package cmd

import (
	"log"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/hichuyamichu/metallum/internal/db"
	"github.com/spf13/cobra"
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
		d := db.Connect()
		driver, err := postgres.WithInstance(d.DB(), &postgres.Config{})
		if err != nil {
			log.Fatal(err)
		}
		m, err := migrate.NewWithDatabaseInstance(
			"file://migrations",
			"postgres", driver)

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
