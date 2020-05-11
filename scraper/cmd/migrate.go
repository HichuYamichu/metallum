package cmd

import (
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const (
	up   = "up"
	down = "down"
)

var migrateCmd = &cobra.Command{
	Use:       "migrate",
	Short:     "Runs DB migrations",
	ValidArgs: []string{up, down},
	Args:      cobra.OnlyValidArgs,
	Run: func(cmd *cobra.Command, args []string) {
		dbHost := viper.GetString("db.host")
		dbPort := viper.GetString("db.port")
		dbUser := viper.GetString("db.user")
		dbName := viper.GetString("db.name")
		dbPass := viper.GetString("db.pass")
		connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", dbUser, dbPass, dbHost, dbPort, dbName)
		m, err := migrate.New("file://migrations", connStr)
		if err != nil {
			log.Fatal(err)
		}

		switch args[0] {
		case up:
			if err := m.Up(); err != nil {
				log.Fatal(err)
			}
		case down:
			if err := m.Down(); err != nil {
				log.Fatal(err)
			}
		}
	},
}
