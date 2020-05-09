package server

import (
	"fmt"
	"sync"
	"time"

	"github.com/hichuyamichu/metallum/pkg"
)

const (
	maxBandWokers = 25
	// this is per bandWorker so total album workers is maxBandWokers * maxAlbumWokers
	maxAlbumWokers = 25
)

func (s *Server) Update(day time.Time, kind pkg.Kind) {
	workerWG := &sync.WaitGroup{}
	bandJobs := make(chan string)
	for w := 1; w <= maxBandWokers; w++ {
		workerWG.Add(1)
		go s.bandWorker(bandJobs, workerWG)
	}
	for url := range pkg.GenerateBandsURLs(day, kind) {
		bandJobs <- url
	}
	close(bandJobs)
	workerWG.Wait()
}

func (s *Server) Full() {
	workerWG := &sync.WaitGroup{}
	bandJobs := make(chan string)
	for w := 1; w <= maxBandWokers; w++ {
		workerWG.Add(1)
		go s.bandWorker(bandJobs, workerWG)
	}
	for url := range pkg.GenerateAllBandURLs() {
		bandJobs <- url
	}
	close(bandJobs)
	workerWG.Wait()
}

func (s *Server) bandWorker(jobs <-chan string, wg *sync.WaitGroup) {
	defer wg.Done()
	for url := range jobs {
		workerWG := &sync.WaitGroup{}
		albumJobs := make(chan string)

		band, _ := pkg.ScrapeBand(url)
		s.db.Save(band)

		for w := 1; w <= maxAlbumWokers; w++ {
			workerWG.Add(1)
			go s.albumWorker(albumJobs, workerWG)
		}

		for _, albumID := range band.Albums {
			albumJobs <- albumID
		}
		close(albumJobs)
		workerWG.Wait()
	}
}

func (s *Server) albumWorker(jobs <-chan string, wg *sync.WaitGroup) {
	defer wg.Done()
	for albumID := range jobs {
		url := fmt.Sprintf("%s/albums/what/ever/%s", pkg.BaseURL, albumID)
		album, _ := pkg.ScrapeAlbum(url)
		s.db.Save(album)
		for _, song := range album.Songs {
			s.db.Save(song)
		}
	}
}
