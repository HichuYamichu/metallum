package server

import (
	"sync"
	"time"

	"github.com/hichuyamichu/metallum/db"
	"github.com/hichuyamichu/metallum/models"
	"github.com/hichuyamichu/metallum/pkg"
	"github.com/labstack/echo/v4"
)

func (s *Server) CommandHandler(c echo.Context) error {
	type commandPayload struct {
		Name string   `json:"name"`
		Args []string `json:"args"`
	}
	cmd := &commandPayload{}
	if err := c.Bind(cmd); err != nil {
		return err
	}

	switch cmd.Name {
	case "migrate":
		db.Instance.AutoMigrate(&models.Band{}, &models.Album{}, &models.Song{})
	case "full":
	case "update":
		today := time.Now()
		wg := &sync.WaitGroup{}
		for url := range pkg.GenerateBandsURLs(today, cmd.Args[0]) {
			wg.Add(1)
			go func(url string) {
				defer wg.Done()
				band := pkg.ScrapeBand(url)
				db.Instance.Save(band)
			}(url)
		}
		wg.Wait()
	}

	return nil
}
