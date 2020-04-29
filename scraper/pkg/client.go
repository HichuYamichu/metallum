package pkg

import (
	"net/http"

	"github.com/sethgrid/pester"
)

var client *Client

func init() {
	client = NewClient()
}

type Client struct {
	*pester.Client
}

func NewClient() *Client {
	return &Client{pester.New()}
}

func (c *Client) Get(url string) (*http.Response, error) {
	// fmt.Println(url)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Add("Accept", `application/json, text/javascript, */*; q=0.01`)
	req.Header.Add("sec-fetch-dest", `empty`)
	req.Header.Add("sec-fetch-mode", `cors`)
	req.Header.Add("sec-fetch-site", `same-origin`)
	req.Header.Add("User-Agent", `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11`)
	res, err := c.Do(req)
	if err != nil {
		return nil, err
	}
	return res, nil
}
