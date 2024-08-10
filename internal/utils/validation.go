package utils

import (
	"url-shortener/internal/graph/gqmodel"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/go-ozzo/ozzo-validation/is"
)

func ValidateCreateUser(input *gqmodel.CreateUser) error {
	return validation.ValidateStruct(&input,
		validation.Field(&input.Name, validation.Required, validation.Length(2, 255)),
		validation.Field(&input.Email, validation.Required, is.Email),
	)
}

func ValidateCreateDomain(input *gqmodel.CreateDomain) error {
	return validation.ValidateStruct(&input,
		validation.Field(&input.Host, validation.Required, is.Host),
	)
}

func ValidateCreateLink(input *gqmodel.CreateLink) error {
	return validation.ValidateStruct(&input,
		validation.Field(&input.Hash, validation.Length(4, 60)),
		validation.Field(&input.OriginalLink, validation.Required, is.URL),
	)
}
