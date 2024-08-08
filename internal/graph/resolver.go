package graph

import (
	"context"
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
