package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"price-point-backend/internal/auth"
	"price-point-backend/internal/calculator"
	"price-point-backend/internal/database"
	"price-point-backend/internal/handlers"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// 1. Load file .env
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: Tidak menemukan file .env, menggunakan environment default")
	}

	// 2. Konek ke MongoDB
	database.ConnectDB()

	// 3. Setup Gin Router (Gunakan New + Logger + Recovery agar pro)
	r := gin.New()
	r.Use(gin.Logger())   // Munculkan log setiap request di terminal
	r.Use(gin.Recovery()) // Mencegah server mati jika ada panic

	// 4. Middleware CORS (Izinkan multiple origins)
	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		allowedOriginsStr := os.Getenv("FRONTEND_URL")
		if allowedOriginsStr == "" {
			allowedOriginsStr = "http://localhost:3000"
		}
		
		allowedOrigin := "http://localhost:3000"
		origins := strings.Split(allowedOriginsStr, ",")
		
		if origin != "" {
			for _, o := range origins {
				if strings.TrimSpace(o) == origin {
					allowedOrigin = origin
					break
				}
			}
		} else if len(origins) > 0 {
			allowedOrigin = strings.TrimSpace(origins[0])
		}

		c.Writer.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, PATCH, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// 5. Routing API
	api := r.Group("/api")
	{
		// Public: Kalkulator
		api.POST("/calculate", func(c *gin.Context) {
			var input calculator.SimulationInput
			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Format input tidak valid"})
				return
			}
			result := calculator.CalculatePrice(input)
			c.JSON(http.StatusOK, gin.H{"status": "success", "data": result})
		})

		// Public: Auth
		api.POST("/register", handlers.Register)
		api.POST("/login", handlers.Login)

		// Protected/Hybrid: Simulations
		sims := api.Group("/simulations")
		sims.Use(auth.AuthMiddleware())
		{
			sims.POST("/save", handlers.SaveSimulation)
			sims.GET("/history", handlers.GetHistory)
			sims.DELETE("/:id", handlers.DeleteSimulation)
		}
	}

	// 6. Handling Route Not Found
	r.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"message": "Endpoint tidak ditemukan"})
	})

	// 7. Jalankan Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("🚀 Server Price-Point menyala di port %s", port)
	r.Run(":" + port)
}