package server

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/hichuyamichu/metallum/pkg"
	"github.com/jackc/pgx/v4"
)

const (
	maxBandWokers = 25
	// this is per bandWorker so total album workers is maxBandWokers * maxAlbumWokers
	maxAlbumWokers = 25
)

type albumJob struct {
	albumID string
	bandID  string
}

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
		albumJobs := make(chan albumJob)

		band, _ := pkg.ScrapeBand(url)
		s.db.Exec(context.Background(), `INSERT INTO band(
			id, name, description, country, location, formed_in, status, genre, themes, active)
		 	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			band.ID, band.Name, band.Description, band.Country, band.Location, band.FormedIn, band.Status, band.Genre, band.Themes, band.Active)

		for w := 1; w <= maxAlbumWokers; w++ {
			workerWG.Add(1)
			go s.albumWorker(albumJobs, workerWG)
		}

		for _, albumID := range band.Albums {
			albumJobs <- albumJob{albumID: albumID, bandID: band.ID}
		}
		close(albumJobs)
		workerWG.Wait()
	}
}

func (s *Server) albumWorker(jobs <-chan albumJob, wg *sync.WaitGroup) {
	defer wg.Done()
	for job := range jobs {
		url := fmt.Sprintf("%s/albums/what/ever/%s", pkg.BaseURL, job.albumID)
		album, _ := pkg.ScrapeAlbum(url)
		query := `INSERT INTO album(
			id, title, type, release, catalog, band_id)
			VALUES ($1, $2, $3, $4, $5, $6);`
		batch := &pgx.Batch{}
		batch.Queue(query, album.ID, album.Title, album.Type, album.Release, album.Catalog, job.bandID)
		for _, song := range album.Songs {
			query := `INSERT INTO song(
				id, title, length, lyrics, album_id)
				VALUES ($1, $2, $3, $4, $5);`
			batch.Queue(query, song.ID, song.Title, song.Length, song.Lyrics, album.ID)
		}
		res := s.db.SendBatch(context.Background(), batch)
		res.Close()
	}
}
