package db

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/spf13/viper"
)

func Connect() *pgxpool.Pool {
	dbHost := viper.GetString("db.host")
	dbPort := viper.GetString("db.port")
	dbUser := viper.GetString("db.user")
	dbName := viper.GetString("db.name")
	dbPass := viper.GetString("db.pass")

	// connStr := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable", dbHost, dbPort, dbUser, dbName, dbPass)
	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", dbUser, dbPass, dbHost, dbPort, dbName)
	pool, err := pgxpool.Connect(context.Background(), connStr)
	if err != nil {
		panic(err)
	}
	return pool
}
