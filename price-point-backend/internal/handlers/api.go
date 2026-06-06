package handlers

import (
	"context"
	"log"
	"net/http"
	"price-point-backend/internal/auth"
	"price-point-backend/internal/database"
	"price-point-backend/internal/models"
	"regexp"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

// Regex sederhana untuk validasi format email
var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

func Register(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Input tidak valid"})
		return
	}

	// --- VALIDASI EMAIL FORMAT ---
	if user.Email == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email tidak boleh kosong"})
		return
	}
	if !emailRegex.MatchString(user.Email) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format email tidak valid"})
		return
	}

	// --- VALIDASI PASSWORD MINIMUM ---
	if len(user.Password) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password minimal 6 karakter"})
		return
	}

	collection := database.GetCollection("users")

	// --- CEK EMAIL GANDA ---
	var existingUser models.User
	err := collection.FindOne(context.Background(), bson.M{"email": user.Email}).Decode(&existingUser)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email sudah terdaftar"})
		return
	}

	// Hash Password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Println("Error hashing password:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal memproses pendaftaran"})
		return
	}
	user.Password = string(hashedPassword)

	res, err := collection.InsertOne(context.Background(), user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mendaftar"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Berhasil mendaftar", "id": res.InsertedID})
}

func Login(c *gin.Context) {
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Input tidak valid"})
		return
	}

	var foundUser models.User
	collection := database.GetCollection("users")
	err := collection.FindOne(context.Background(), bson.M{"email": input.Email}).Decode(&foundUser)
	if err != nil {
		// Gunakan pesan generik untuk keamanan (mencegah user enumeration)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email atau password salah"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(input.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email atau password salah"})
		return
	}

	// --- FIX: Handle error dari GenerateToken ---
	token, err := auth.GenerateToken(foundUser.ID.Hex())
	if err != nil {
		log.Println("Error generating JWT token:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat sesi login"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Login sukses", "token": token})
}

func SaveSimulation(c *gin.Context) {
	var sim models.Simulation
	if err := c.ShouldBindJSON(&sim); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Input tidak valid"})
		return
	}

	// UserID sudah dijamin ada oleh AuthMiddleware (tidak lagi guest)
	userID, exists := c.Get("userID")
	if !exists || userID.(string) == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Autentikasi diperlukan"})
		return
	}
	sim.UserID = userID.(string)

	// Konsistensi waktu UTC
	sim.CreatedAt = primitive.NewDateTimeFromTime(time.Now().UTC())

	collection := database.GetCollection("simulations")
	res, err := collection.InsertOne(context.Background(), sim)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Simulasi berhasil disimpan", "id": res.InsertedID})
}

func GetHistory(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists || userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Tidak ada akses"})
		return
	}

	// --- FIX: Pagination via query params (default: page=1, limit=50) ---
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 50 // Batas maksimum 100 dokumen per request
	}

	skip := int64((page - 1) * limit)
	limitVal := int64(limit)

	collection := database.GetCollection("simulations")

	// --- FIX: Sort by created_at descending (terbaru di atas) ---
	findOpts := options.Find().
		SetSort(bson.D{{Key: "created_at", Value: -1}}).
		SetSkip(skip).
		SetLimit(limitVal)

	filter := bson.M{"user_id": userID}
	cursor, err := collection.Find(context.Background(), filter, findOpts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data"})
		return
	}
	defer cursor.Close(context.Background())

	var simulations []models.Simulation
	if err = cursor.All(context.Background(), &simulations); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membaca data"})
		return
	}

	if simulations == nil {
		simulations = []models.Simulation{}
	}

	// Hitung total dokumen untuk info pagination
	total, _ := collection.CountDocuments(context.Background(), filter)

	c.JSON(http.StatusOK, gin.H{
		"data":  simulations,
		"page":  page,
		"limit": limit,
		"total": total,
	})
}

// --- NEW: Handler untuk menghapus simulasi berdasarkan ID ---
func DeleteSimulation(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists || userID.(string) == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Autentikasi diperlukan"})
		return
	}

	// Ambil ID simulasi dari URL parameter
	simID := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(simID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format ID tidak valid"})
		return
	}

	collection := database.GetCollection("simulations")

	// Pastikan simulasi milik user yang sedang login (mencegah IDOR)
	filter := bson.M{
		"_id":     objectID,
		"user_id": userID.(string),
	}

	result, err := collection.DeleteOne(context.Background(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus data"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Data tidak ditemukan atau bukan milik Anda"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Simulasi berhasil dihapus"})
}