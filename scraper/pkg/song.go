package pkg

type Song struct {
	ID      string `gorm:"primary_key"`
	Title   *string
	Length  *string
	Lyrics  *string
	AlbumID string
}

func (Song) TableName() string {
	return "song"
}
