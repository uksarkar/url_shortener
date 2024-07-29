package graph

import (
	"context"
	"database/sql"
	"fmt"
	"url-shortener/internal/graph/gqmodel"
	"url-shortener/internal/service"

	"github.com/99designs/gqlgen/graphql"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	URLService *service.URLService
}

func (r *Resolver) GetRequestedFields(ctx context.Context) []string {
	fields := graphql.CollectFieldsCtx(ctx, nil)
	fieldNames := []string{}
	for _, field := range fields {
		fieldNames = append(fieldNames, field.Name)
	}
	return fieldNames
}

func (r *Resolver) ScanFields(rows *sql.Rows, url *gqmodel.URL, fields ...string) error {
	// Create a slice of empty interfaces to hold the column pointers
	values := make([]interface{}, len(fields))
	for i, field := range fields {
		switch field {
		case "id":
			values[i] = &url.ID
		case "original_url":
			values[i] = &url.OriginalURL
		case "short_url":
			values[i] = &url.ShortURL
		case "created_at":
			values[i] = &url.CreatedAt
		default:
			return fmt.Errorf("unknown field: %s", field)
		}
	}
	return rows.Scan(values...)
}
