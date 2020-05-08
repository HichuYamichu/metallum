package pkg

type Album struct {
	ID      string `gorm:"primary_key"`
	Title   *string
	Type    *string
	Release *string
	Catalog *string
	Songs   []Song
}

func (Album) TableName() string {
	return "album"
}
