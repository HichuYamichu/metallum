package cmd

import (
	"github.com/hichuyamichu/metallum/internal/db"
	"github.com/hichuyamichu/metallum/pkg"
	"github.com/spf13/cobra"
)

var migrateCmd = &cobra.Command{
	Use:   "migrate",
	Short: "Runs DB migrations",
	Run: func(cmd *cobra.Command, args []string) {
		d := db.Connect()
		d.DropTableIfExists(&pkg.Band{}, &pkg.Album{}, &pkg.Song{})
		d.AutoMigrate(&pkg.Band{}, &pkg.Album{}, &pkg.Song{})
	},
}
