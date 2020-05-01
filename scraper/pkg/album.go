package pkg

type Album struct {
	ID      string `gorm:"primary_key"`
	Name    *string
	Type    *string
	Release *string
	Catalog *string
	BandID  string
	Songs   []Song
}

func (Album) TableName() string {
	return "album"
}
