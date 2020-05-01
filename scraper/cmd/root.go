package cmd

import (
	"log"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	rootCmd = &cobra.Command{
		Use:   "metallum",
		Short: "Scraping tool for metal-archives.com",
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
