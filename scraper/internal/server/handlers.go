package server

import (
	"fmt"
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
	case "scrape":
		go s.Full()
	case "update":
		today := time.Now()
		kind, err := pkg.KindFromString(cmd.Args[0])
		if err != nil {
			return err
		}
		go s.Update(today, kind)
	default:
		return fmt.Errorf("invalid command")
	}

	return nil
}
