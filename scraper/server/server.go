package server

import (
	"context"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
)

// Server main server struct
type Server struct {
	router *echo.Echo
}

// New bootstraps server
func New() *Server {
	server := &Server{
		router: echo.New(),
	}
	server.configure()
	server.setRoutes()
	return server
}

func (s *Server) configure() {
	s.router.HideBanner = true
	s.router.Logger.SetLevel(log.INFO)
	s.router.Use(middleware.Logger())
	s.router.Use(middleware.Recover())
}

func (s *Server) setRoutes() {
	s.router.GET("/debug/pprof/*", echo.WrapHandler(http.DefaultServeMux))
	api := s.router.Group("/api")
	api.POST("/command", s.CommandHandler)
}

// Shutdown shuts down the server
func (s *Server) Shutdown(ctx context.Context) {
	s.router.Shutdown(ctx)
}

// Start starts the server
func (s *Server) Start(host string, port string) error {
	return s.router.Start(fmt.Sprintf("%s:%s", host, port))
}
