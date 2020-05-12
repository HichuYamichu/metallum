package cmd

import (
	"log"

	"github.com/hichuyamichu/metallum/internal/db"
	"github.com/hichuyamichu/metallum/internal/server"
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
		s := server.New(d)
		err := s.Migrate(args[0])
		if err != nil {
			log.Fatal(err)
		}
	},
}
