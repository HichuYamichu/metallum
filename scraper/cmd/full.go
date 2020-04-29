package cmd

import (
	"github.com/spf13/cobra"
)

var fullScrapeCmd = &cobra.Command{
	Use:   "full",
	Short: "Scrapes all bands data (will take a while)",
	Run: func(cmd *cobra.Command, args []string) {

	},
}
