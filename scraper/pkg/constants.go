package pkg

import "fmt"

const (
	baseURL         = "https://www.metal-archives.com"
	discographyPath = "/band/discography/id/"
	descPath        = "/band/read-more/id/"
	lyricsPath      = "/release/ajax-view-lyrics/id/"
	listPath        = "/archives/ajax-band-list/selection/"
)

// Kind kind of band
type Kind string

const (
	// Created recently added
	Created Kind = "created"
	// Modified recently updated
	Modified Kind = "modified"
)

// KindFromString produces Kind if valid string is passed
func KindFromString(s string) (Kind, error) {
	switch Kind(s) {
	case Created:
		return Created, nil
	case Modified:
		return Modified, nil
	default:
		return "", fmt.Errorf("invalid kind")
	}
}
