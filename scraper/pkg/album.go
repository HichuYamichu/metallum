package pkg

type Album struct {
	ID      string `gorm:"primary_key"`
	Title   *string
	Type    *string
	Release *string
	Catalog *string
	BandID  string
	Songs   []*Song `gorm:"-"`
}

func (Album) TableName() string {
	return "album"
}
