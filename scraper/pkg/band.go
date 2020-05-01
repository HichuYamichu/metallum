package pkg

type Band struct {
	ID          string `gorm:"primary_key"`
	Name        *string
	Description *string
	Country     *string
	Location    *string
	FormedIn    *string
	Status      *string
	Genre       *string
	Themes      *string
	Active      *string
	Albums      []Album
}

func (Band) TableName() string {
	return "band"
}
