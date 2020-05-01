package server

import (
	"time"

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
		s.db.AutoMigrate(&pkg.Band{}, &pkg.Album{}, &pkg.Song{})
	case "full":
		s.Full()
	case "update":
		today := time.Now()
		kind, err := pkg.KindFromString(cmd.Args[0])
		if err != nil {
			return err
		}
		s.Update(today, kind)
	}

	return nil
}
