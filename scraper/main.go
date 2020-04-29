package main

import (
	_ "expvar"
	_ "net/http/pprof"

	"github.com/hichuyamichu/metallum/cmd"
	_ "github.com/jinzhu/gorm/dialects/mssql"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

func main() {
	cmd.Execute()
}
