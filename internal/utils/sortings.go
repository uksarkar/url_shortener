package utils

import (
	"strings"
	"url-shortener/internal/graph/gqmodel"
)

func PrepareSortBy(sort *gqmodel.SortBy) *gqmodel.SortBy {
	if sort == nil {
		id := "id"
		dir := "desc"

		return &gqmodel.SortBy{
			Column:    &id,
			Direction: &dir,
		}
	}

	if sort.Direction == nil || strings.ToLower(*sort.Direction) == "desc" || strings.ToLower(*sort.Direction) != "asc" {
		*sort.Direction = "DESC"
	}

	if sort.Column == nil {
		*sort.Column = "id"
	}

	return sort
}
