package cmd

import (
	"log"

	"github.com/hichuyamichu/metallum/db"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	rootCmd = &cobra.Command{
		Use:   "metallum",
		Short: "Scraping tool for metal-archives.com",
		PersistentPreRun: func(cmd *cobra.Command, args []string) {
			db.Connect()
		},
		PersistentPostRun: func(cmd *cobra.Command, args []string) {
			db.Disconnect()
		},
	}
)

func Execute() error {
	return rootCmd.Execute()
}

func init() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatal(err)
	}

	rootCmd.AddCommand(migrateCmd)
	rootCmd.AddCommand(listenCmd)
	rootCmd.AddCommand(updateCmd)
	rootCmd.AddCommand(fullScrapeCmd)
}
