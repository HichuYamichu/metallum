package pkg

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/hichuyamichu/metallum/models"
)

const baseURL = "https://www.metal-archives.com"
const discographyPath = "/band/discography/id/"
const lyricsPath = "/release/ajax-view-lyrics/id/"
const listPath = "/archives/ajax-band-list/selection/"

var maIDREGEXP = regexp.MustCompile(`([^\/]+$)`)

func GenerateAllBandURLs() {

}

func GenerateBandsURLs(day time.Time, kind string) <-chan string {
	ch := make(chan string)
	go generateBandsURLs(day, kind, 0, ch)
	return ch
}

func generateBandsURLs(day time.Time, kind string, page int, ch chan string) {
	defer close(ch)
	pathFragment := day.Format("2006-01")
	params := fmt.Sprintf("sEcho=%d&sSortDir_0=desc&iDisplayStart=%d", page+1, page*200)
	url := fmt.Sprintf("%s%s%s/by/%s/json/1?%s", baseURL, listPath, pathFragment, kind, params)
	res, err := client.Get(url)
	if err != nil {
		panic(err)
	}

	type message struct {
		Data [][]string `json:"aaData"`
	}
	m := &message{}
	json.NewDecoder(res.Body).Decode(m)

	for _, dataSet := range m.Data {
		if dataSet[0] != day.Format("January 02") {
			continue
		}
		doc, _ := goquery.NewDocumentFromReader(strings.NewReader(dataSet[1]))
		link, _ := doc.Find("a").Attr("href")
		ch <- link
	}
	lastEl := m.Data[len(m.Data)-1]

	if lastEl[0] == day.Format("January 02") {
		newCh := make(chan string)
		go generateBandsURLs(day, kind, page+1, newCh)
		for link := range newCh {
			ch <- link
		}
	}
}

func ScrapeBand(url string) *models.Band {
	res, err := client.Get(url)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()
	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		panic(err)
	}
	band := &models.Band{}
	band.ID = maIDREGEXP.FindString(url)
	band.Name = normalize(doc.Find(".band_name").Text())
	doc.Find("dd").Each(func(i int, s *goquery.Selection) {
		if i == 0 {
			band.Country = normalize(s.Find("a").Text())
		} else if i == 1 {
			band.Location = normalize(s.Text())
		} else if i == 2 {
			band.Status = normalize(s.Text())
		} else if i == 3 {
			band.FormedIn = normalize(s.Text())
		} else if i == 4 {
			band.Genre = normalize(s.Text())
		} else if i == 5 {
			band.Themes = normalize(s.Text())
		} else if i == 7 {
			band.Active = normalize(s.Text())
		}
	})

	discographyURL := fmt.Sprintf("%s%s%s/tab/all", baseURL, discographyPath, band.ID)
	res, err = client.Get(discographyURL)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()

	albumsWG := &sync.WaitGroup{}
	albumsCh := make(chan models.Album)

	doc, _ = goquery.NewDocumentFromReader(res.Body)
	doc.Find("a").Each(func(i int, s *goquery.Selection) {
		link, _ := s.Attr("href")
		if !strings.Contains(link, fmt.Sprintf("%s/albums", baseURL)) {
			return
		}
		albumsWG.Add(1)
		go func() {
			defer albumsWG.Done()
			album := ScrapeAlbum(link)
			albumsCh <- *album
		}()
	})

	go func() {
		albumsWG.Wait()
		close(albumsCh)
	}()

	for album := range albumsCh {
		band.Albums = append(band.Albums, album)
	}

	return band
}

func ScrapeAlbum(url string) *models.Album {
	res, err := client.Get(url)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()
	doc, _ := goquery.NewDocumentFromReader(res.Body)
	album := &models.Album{}
	album.ID = maIDREGEXP.FindString(url)
	album.Name = normalize(doc.Find("h1.album_name a").Text())
	doc.Find("dd").Each(func(i int, s *goquery.Selection) {
		if i == 0 {
			album.Type = normalize(s.Text())
		} else if i == 1 {
			album.Release = normalize(s.Text())
		} else if i == 2 {
			album.Catalog = normalize(s.Text())
		}
	})

	songsCount := doc.Find("table.table_lyrics tr.odd, table.table_lyrics tr.even").
		Not(".displayNone").
		Not(".sideRow").
		Not(".discRow").
		Length() - 1

	songsWG := &sync.WaitGroup{}
	songsCh := make(chan models.Song)

	doc.Find("table.table_lyrics tr.odd, table.table_lyrics tr.even").
		Not(".displayNone").
		Not(".sideRow").
		Not(".discRow").
		Each(func(i int, s *goquery.Selection) {
			if i >= songsCount {
				return
			}
			songsWG.Add(1)
			go func() {
				defer songsWG.Done()
				song := ScrapeSong(s)
				songsCh <- *song
			}()
		})

	go func() {
		songsWG.Wait()
		close(songsCh)
	}()

	for song := range songsCh {
		album.Songs = append(album.Songs, song)
	}

	return album
}

func ScrapeSong(s *goquery.Selection) *models.Song {
	song := &models.Song{}
	s.Find("td").Each(func(i int, s *goquery.Selection) {
		if i == 0 {
			nameAttr, _ := s.Find("a").Attr("name")
			song.ID = nameAttr
		} else if i == 1 {
			song.Title = normalize(s.Text())
		} else if i == 2 {
			song.Length = normalize(s.Text())
		}
	})
	res, err := client.Get(fmt.Sprintf("%s%s%s", baseURL, lyricsPath, song.ID))
	if err != nil {
		panic(err)
	}
	body, _ := ioutil.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}
	txt := string(body)
	song.Lyrics = &txt

	return song
}

func normalize(s string) *string {
	s = strings.Trim(s, "\t \n")
	s = regexp.MustCompile(`/<\/?[^>]+>/gi`).ReplaceAllString(s, "")
	s = regexp.MustCompile(`/\s{2,}/g`).ReplaceAllString(s, "")
	if s == "N/A" {
		return nil
	} else if s == "(lyrics not available)" {
		return nil
	} else if s == "(Instrumental)" {
		return nil
	}
	return &s
}
