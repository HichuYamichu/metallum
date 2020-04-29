package cmd

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/hichuyamichu/metallum/server"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var listenCmd = &cobra.Command{
	Use:   "listen",
	Short: "Starts http server and listens for commands over network",
	Run: func(cmd *cobra.Command, args []string) {
		server := server.New()

		go func() {
			done := make(chan os.Signal, 1)
			signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
			<-done
			ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
			defer cancel()
			server.Shutdown(ctx)
		}()

		host := viper.GetString("host")
		port := viper.GetString("port")
		log.Fatal(server.Start(host, port))
	},
}
