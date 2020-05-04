package db

import (
	"fmt"

	"github.com/jinzhu/gorm"
	"github.com/spf13/viper"
)

func Connect() *gorm.DB {
	dbHost := viper.GetString("db.host")
	dbPort := viper.GetString("db.port")
	dbUser := viper.GetString("db.user")
	dbName := viper.GetString("db.name")
	dbPass := viper.GetString("db.pass")

	connStr := fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable", dbHost, dbPort, dbUser, dbName, dbPass)
	db, err := gorm.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}
	return db
}
