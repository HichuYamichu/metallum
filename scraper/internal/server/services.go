package server

import (
	"sync"
	"time"

	"github.com/hichuyamichu/metallum/pkg"
)

func (s *Server) Full() {
	wg := &sync.WaitGroup{}
	c := 0
	for url := range pkg.GenerateAllBandURLs() {
		wg.Add(1)
		c++
		go func(url string) {
			defer wg.Done()
			band, _ := pkg.ScrapeBand(url)
			s.db.Save(band)
		}(url)
		if c >= 50 {
			wg.Wait()
			c = 0
		}
	}
	wg.Wait()
}

func (s *Server) Update(day time.Time, kind pkg.Kind) {
	wg := &sync.WaitGroup{}
	for url := range pkg.GenerateBandsURLs(day, kind) {
		wg.Add(1)
		go func(url string) {
			defer wg.Done()
			band, _ := pkg.ScrapeBand(url)
			s.db.Save(band)
		}(url)
	}
	wg.Wait()
}
