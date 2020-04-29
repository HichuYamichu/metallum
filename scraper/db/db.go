package db

import (
	"fmt"
	"strings"

	"github.com/jinzhu/gorm"
	"github.com/spf13/viper"
)

var Instance *gorm.DB

func Connect() error {
	dbHost := viper.GetString("db.host")
	dbPort := viper.GetString("db.port")
	dbUser := viper.GetString("db.user")
	dbName := viper.GetString("db.name")
	dbPass := viper.GetString("db.pass")

	dbType := strings.ToLower(viper.GetString("db.type"))
	var connStr string
	switch dbType {
	case "postgres":
		connStr = fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable", dbHost, dbPort, dbUser, dbName, dbPass)
	case "mysql":
		connStr = fmt.Sprintf("%s:%s@(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", dbUser, dbPass, dbHost, dbPort, dbName)
	case "mssql":
		connStr = fmt.Sprintf("sqlserver://%s:%s@%s:%s?database=%s", dbUser, dbPass, dbHost, dbPort, dbName)
	default:
		dbType = "sqlite3"
		connStr = "./metallum.db"
	}
	var err error

	Instance, err = gorm.Open(dbType, connStr)
	if err != nil {
		return err
	}
	return nil
}

func Disconnect() error {
	return Instance.Close()
}
