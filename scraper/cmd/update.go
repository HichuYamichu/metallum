package cmd

import (
	"sync"
	"time"

	"github.com/hichuyamichu/metallum/db"
	"github.com/hichuyamichu/metallum/pkg"
	"github.com/spf13/cobra"
)

var updateCmd = &cobra.Command{
	Use:       "update",
	Short:     "Scrapes created/modified bands from a given day",
	ValidArgs: []string{"created", "modified"},
	Args:      cobra.OnlyValidArgs,
	Run: func(cmd *cobra.Command, args []string) {
		today := time.Now()
		wg := &sync.WaitGroup{}
		for url := range pkg.GenerateBandsURLs(today, args[0]) {
			wg.Add(1)
			go func(url string) {
				defer wg.Done()
				band := pkg.ScrapeBand(url)
				db.Instance.Save(band)
			}(url)
		}
		wg.Wait()
	},
}
