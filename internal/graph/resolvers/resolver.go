package gq_resolver

import (
	"context"
	"url-shortener/internal/service"

	"github.com/99designs/gqlgen/graphql"
	"github.com/vektah/gqlparser/v2/ast"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	LinkService *service.LinkService
}

func (r *Resolver) GetRequestedFields(ctx context.Context) []string {
	fields := graphql.CollectFieldsCtx(ctx, nil)
	fieldNames := []string{}
	for _, field := range fields {
		fieldNames = append(fieldNames, field.Name)
	}
	return fieldNames
}

// GetNestedFieldsOf extracts and returns immediate nested field names of the specified field.
func (r *Resolver) GetNestedFieldsOf(ctx context.Context, fieldName string) []string {
	// Collect fields for the specified context and field name
	collectedFields := graphql.CollectFieldsCtx(ctx, []string{fieldName})
	fieldNames := []string{}

	for _, collectedField := range collectedFields {
		if collectedField.Name == fieldName {
			// Iterate over the selection set of the specified field
			for _, selection := range collectedField.Field.SelectionSet {
				if field, ok := selection.(*ast.Field); ok {
					fieldNames = append(fieldNames, field.Name)
				}
			}
		}
	}

	return fieldNames
}
