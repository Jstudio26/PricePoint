package database

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Client *mongo.Client

func ConnectDB() {
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		uri = "mongodb://localhost:27017"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal("Gagal koneksi ke MongoDB:", err)
	}

	// Ping database untuk memastikan koneksi jalan
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("MongoDB tidak merespon:", err)
	}

	log.Println("✅ Berhasil terhubung ke MongoDB!")
	Client = client

	// Buat index setelah koneksi berhasil
	EnsureIndexes()
}

// Fungsi pembantu untuk mengambil koleksi
func GetCollection(collectionName string) *mongo.Collection {
	return Client.Database("pricepoint_db").Collection(collectionName)
}

// EnsureIndexes membuat index penting untuk performa query dan data integrity
func EnsureIndexes() {
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	// ═══════════════════════════════════════════════════════════
	// INDEX 1: users.email — Unique Index
	// Mencegah duplikasi email di level database (defense in depth)
	// dan mempercepat query FindOne saat login/register
	// ═══════════════════════════════════════════════════════════
	usersCol := GetCollection("users")
	_, err := usersCol.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.D{{Key: "email", Value: 1}},
		Options: options.Index().SetUnique(true).SetName("idx_users_email_unique"),
	})
	if err != nil {
		log.Println("⚠️  Gagal membuat index users.email:", err)
	} else {
		log.Println("📇 Index users.email (unique) — OK")
	}

	// ═══════════════════════════════════════════════════════════
	// INDEX 2: simulations.user_id + created_at — Compound Index
	// Mempercepat query GetHistory yang filter by user_id
	// dan sort by created_at descending
	// ═══════════════════════════════════════════════════════════
	simsCol := GetCollection("simulations")
	_, err = simsCol.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.D{{Key: "user_id", Value: 1}, {Key: "created_at", Value: -1}},
		Options: options.Index().SetName("idx_sims_userid_createdat"),
	})
	if err != nil {
		log.Println("⚠️  Gagal membuat index simulations:", err)
	} else {
		log.Println("📇 Index simulations.user_id+created_at — OK")
	}
}