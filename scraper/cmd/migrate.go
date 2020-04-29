package cmd

import (
	"github.com/hichuyamichu/metallum/db"
	"github.com/hichuyamichu/metallum/models"
	"github.com/spf13/cobra"
)

var migrateCmd = &cobra.Command{
	Use:   "migrate",
	Short: "Runs DB migrations",
	Run: func(cmd *cobra.Command, args []string) {
		db.Instance.AutoMigrate(&models.Band{}, &models.Album{}, &models.Song{})
	},
}
