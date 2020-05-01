package cmd

import (
	"time"

	"github.com/hichuyamichu/metallum/internal/db"
	"github.com/hichuyamichu/metallum/pkg"
	"github.com/hichuyamichu/metallum/internal/server"
	"github.com/spf13/cobra"
)

var updateCmd = &cobra.Command{
	Use:       "update",
	Short:     "Scrapes created/modified bands from a given day",
	ValidArgs: []string{"created", "modified"},
	Args:      cobra.OnlyValidArgs,
	Run: func(cmd *cobra.Command, args []string) {
		today := time.Now()
		kind, _ := pkg.KindFromString(args[0])
		d := db.Connect()
		s := server.New(d)
		s.Update(today, kind)
	},
}
