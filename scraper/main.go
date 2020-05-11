package main

import (
	_ "net/http/pprof"

	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/hichuyamichu/metallum/cmd"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

func main() {
	cmd.Execute()
}
