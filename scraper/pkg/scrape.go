package pkg

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"regexp"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

var maIDREGEXP = regexp.MustCompile(`([^\/]+$)`)

type message struct {
	ItemsCount int        `json:"iTotalDisplayRecords"`
	Data       [][]string `json:"aaData"`
}

var alpha = []string{"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#", "~"}

func PerLetterGenerate() []<-chan string {
	chans := make([]<-chan string, len(alpha))
	for _, letter := range alpha {
		ch := make(chan string)
		go perLetterGenerate(letter, ch)
		chans = append(chans, ch)
	}
	return chans
}

func perLetterGenerate(letter string, ch chan string) {
	defer close(ch)
	url := fmt.Sprintf("%s/browse/ajax-letter/l/%s/json/1?sEcho=1", baseURL, letter)
	res, err := client.Get(url)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()
	m := &message{}
	json.NewDecoder(res.Body).Decode(m)
	for i, sEcho := 0, 0; i < m.ItemsCount; i += 500 {
		sEcho++
		url := fmt.Sprintf("%s/browse/ajax-letter/l/%s/json/1?sEcho=%d&iDisplayStart=%d&iDisplayLength=500", baseURL, letter, sEcho, i)
		res, err := client.Get(url)
		if err != nil {
			panic(err)
		}
		defer res.Body.Close()
		m := &message{}
		json.NewDecoder(res.Body).Decode(m)
		for _, dataSet := range m.Data {
			doc, _ := goquery.NewDocumentFromReader(strings.NewReader(dataSet[0]))
			link, _ := doc.Find("a").Attr("href")
			ch <- link
		}
	}
}

func GenerateAllBandURLs() <-chan string {
	ch := make(chan string)
	go generateAllBandURLs(ch)
	return ch
}

func generateAllBandURLs(ch chan string) {
	defer close(ch)
	sEcho := 0
	for _, letter := range alpha {
		sEcho++
		url := fmt.Sprintf("%s/browse/ajax-letter/l/%s/json/1?sEcho=%d", BaseURL, letter, sEcho)
		res, err := client.Get(url)
		if err != nil {
			panic(err)
		}
		defer res.Body.Close()
		m := &message{}
		json.NewDecoder(res.Body).Decode(m)
		for i := 0; i < m.ItemsCount; i += 500 {
			sEcho++
			url := fmt.Sprintf("%s/browse/ajax-letter/l/%s/json/1?sEcho=%d&iDisplayStart=%d&iDisplayLength=500", BaseURL, letter, sEcho, i)
			res, err := client.Get(url)
			defer res.Body.Close()
			if err != nil {
				panic(err)
			}
			m := &message{}
			json.NewDecoder(res.Body).Decode(m)
			for _, dataSet := range m.Data {
				doc, _ := goquery.NewDocumentFromReader(strings.NewReader(dataSet[0]))
				link, _ := doc.Find("a").Attr("href")
				ch <- link
			}
		}
	}
}

// GenerateBandsURLs produces URLs of bands updated or added during provided day.
func GenerateBandsURLs(day time.Time, kind Kind) <-chan string {
	ch := make(chan string)
	go generateBandsURLs(day, kind, 0, ch)
	return ch
}

func generateBandsURLs(day time.Time, kind Kind, page int, ch chan string) {
	defer close(ch)
	pathFragment := day.Format("2006-01")
	params := fmt.Sprintf("sEcho=%d&sSortDir_0=desc&iDisplayStart=%d", page+1, page*200)
	url := fmt.Sprintf("%s%s%s/by/%s/json/1?%s", BaseURL, ListPath, pathFragment, kind, params)
	res, err := client.Get(url)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()

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

// ScrapeBand scrapes band data
func ScrapeBand(url string) (*Band, error) {
	res, err := client.Get(url)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return nil, err
	}
	band := &Band{}
	band.ID = maIDREGEXP.FindString(url)
	descCh := make(chan *string)
	go scrapeBandDesc(descCh, band.ID)
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

	discographyURL := fmt.Sprintf("%s%s%s/tab/all", BaseURL, DiscographyPath, band.ID)
	discoRes, err := client.Get(discographyURL)
	if err != nil {
		return nil, err
	}
	defer discoRes.Body.Close()

	doc, _ = goquery.NewDocumentFromReader(discoRes.Body)
	doc.Find("a").Each(func(i int, s *goquery.Selection) {
		link, _ := s.Attr("href")
		if !strings.Contains(link, fmt.Sprintf("%s/albums", BaseURL)) {
			return
		}
		id := maIDREGEXP.FindString(link)
		band.Albums = append(band.Albums, id)
	})

	descURL := fmt.Sprintf("%s%s%s", BaseURL, DescPath, band.ID)
	descRes, err := client.Get(descURL)
	if err != nil {
		return nil, err
	}
	defer descRes.Body.Close()
	responseData, err := ioutil.ReadAll(descRes.Body)
	if err != nil {
		return nil, err
	}
	band.Description = normalize(string(responseData))

	return band, nil
}

// ScrapeAlbum scrapes album along with songs
func ScrapeAlbum(url string) (*Album, error) {
	res, err := client.Get(url)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	doc, _ := goquery.NewDocumentFromReader(res.Body)
	album := &Album{}
	album.ID = maIDREGEXP.FindString(url)
	album.Title = normalize(doc.Find("h1.album_name a").Text())
	doc.Find("dd").Each(func(i int, s *goquery.Selection) {
		if i == 0 {
			album.Type = normalize(s.Text())
		} else if i == 1 {
			album.Release = normalize(s.Text())
		} else if i == 2 {
			album.Catalog = normalize(s.Text())
		}
	})

	doc.Find("table.table_lyrics tr.odd, table.table_lyrics tr.even").
		Not(".displayNone").
		Not(".sideRow").
		Not(".discRow").
		EachWithBreak(func(i int, s *goquery.Selection) bool {
			song, e := ScrapeSong(s)
			if e != nil {
				err = e
				return false
			}
			album.Songs = append(album.Songs, song)
			return true
		})
	if err != nil {
		return nil, err
	}

	return album, nil
}

// ScrapeSong scrapes song
func ScrapeSong(s *goquery.Selection) (*Song, error) {
	song := &Song{}
	var err error
	s.Find("td").EachWithBreak(func(i int, s *goquery.Selection) bool {
		if i == 0 {
			nameAttr, _ := s.Find("a").Attr("name")
			song.ID = nameAttr
		} else if i == 1 {
			song.Title = normalize(s.Text())
		} else if i == 2 {
			song.Length = normalize(s.Text())
		} else if i == 3 {
			_, ok := s.Find("a").Attr("href")
			if ok {
				res, e := client.Get(fmt.Sprintf("%s%s%s", BaseURL, LyricsPath, song.ID))
				if e != nil {
					err = e
					return false
				}
				defer res.Body.Close()
				body, e := ioutil.ReadAll(res.Body)
				if e != nil {
					err = e
					return false
				}
				song.Lyrics = normalize(string(body))
			}
		}
		return true
	})
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	return song, nil
}

func normalize(s string) *string {
	s = strings.Trim(s, "\t \n")
	s = regexp.MustCompile(`(?mi)<\/?[^>]+>`).ReplaceAllString(s, "")
	if s == "N/A" {
		return nil
	} else if s == "(lyrics not available)" {
		return nil
	} else if s == "(Instrumental)" {
		return nil
	} else if s == "''" || s == "\"\"" {
		return nil
	}
	return &s
}
