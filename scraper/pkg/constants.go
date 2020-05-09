package pkg

import "fmt"

const (
	BaseURL         = "https://www.metal-archives.com"
	DiscographyPath = "/band/discography/id/"
	DescPath        = "/band/read-more/id/"
	LyricsPath      = "/release/ajax-view-lyrics/id/"
	ListPath        = "/archives/ajax-band-list/selection/"
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
