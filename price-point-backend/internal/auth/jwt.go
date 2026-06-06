package auth

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// Generate token saat login berhasil
func GenerateToken(userID string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(), // Expire 3 hari
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// Middleware: Mengecek apakah user mengirim token JWT yang valid
// Semua endpoint yang menggunakan middleware ini WAJIB login (tidak ada Guest)
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			// Tidak ada token = tidak boleh akses endpoint protected
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Autentikasi diperlukan. Silakan login terlebih dahulu."})
			c.Abort()
			return
		}

		// Format token: "Bearer <token>"
		tokenString := strings.Split(authHeader, "Bearer ")
		if len(tokenString) < 2 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Format token salah"})
			c.Abort()
			return
		}

		secret := os.Getenv("JWT_SECRET")
		token, err := jwt.Parse(tokenString[1], func(token *jwt.Token) (interface{}, error) {
			// Pastikan signing method sesuai (mencegah alg switch attack)
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token tidak valid atau expired"})
			c.Abort()
			return
		}

		// Simpan userID ke context agar bisa dipakai di endpoint selanjutnya
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token claims tidak valid"})
			c.Abort()
			return
		}

		userIDVal, ok := claims["user_id"].(string)
		if !ok || userIDVal == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID tidak ditemukan dalam token"})
			c.Abort()
			return
		}

		c.Set("userID", userIDVal)
		c.Next()
	}
}