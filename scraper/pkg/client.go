package pkg

import (
	"context"
	"net/http"
	"time"

	"github.com/hashicorp/go-retryablehttp"
)

var client *Client

func init() {
	client = NewClient()
}

type Client struct {
	*retryablehttp.Client
}

func NewClient() *Client {
	retryClient := retryablehttp.NewClient()
	retryClient.CheckRetry = retryPolicy
	retryClient.RetryWaitMax = 3 * time.Minute
	retryClient.RetryMax = 2147483647
	retryClient.Logger = nil
	return &Client{retryClient}
}

func (c *Client) Get(url string) (*http.Response, error) {
	req, err := retryablehttp.NewRequest("GET", url, nil)
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

func retryPolicy(ctx context.Context, resp *http.Response, err error) (bool, error) {
	if err != nil {
		return true, nil
	}

	if resp.StatusCode != 200 {
		return true, nil
	}
	return false, nil
}
