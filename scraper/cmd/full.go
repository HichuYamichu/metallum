package cmd

import (
	"github.com/hichuyamichu/metallum/internal/db"
	"github.com/hichuyamichu/metallum/internal/server"
	"github.com/spf13/cobra"
)

var fullScrapeCmd = &cobra.Command{
	Use:   "full",
	Short: "Scrapes all bands data (will take a while)",
	Run: func(cmd *cobra.Command, args []string) {
		d := db.Connect()
		s := server.New(d)
		s.Full()
	},
}
