package repository

import (
	"database/sql"
	"fmt"
	"strings"
	"url-shortener/internal/graph/gqmodel"
	"url-shortener/internal/utils"
)

type LinkRepository struct {
	DB *sql.DB
}

func NewLinkRepository(db *sql.DB) *LinkRepository {
	return &LinkRepository{DB: db}
}

func (repo *LinkRepository) Save(url gqmodel.Link) error {
	query := "INSERT INTO urls (original_url, hash, domain_id, is_active) VALUES ($1, $2, $3, $4)"
	_, err := repo.DB.Exec(query, url.OriginalLink, url.Hash, url.DomainID, url.IsActive)
	return err
}

func (repo *LinkRepository) Find(id int) (*gqmodel.Link, error) {
	var url gqmodel.Link
	query := "SELECT id, original_url, hash, is_active, created_at, updated_at FROM urls WHERE id=$1"
	err := repo.DB.QueryRow(query, id).Scan(&url.ID, &url.OriginalLink, &url.Hash, &url.IsActive, &url.CreatedAt, &url.UpdatedAt)
	return &url, err
}

func (repo *LinkRepository) FindByHash(hash string) (gqmodel.Link, error) {
	var url gqmodel.Link
	query := "SELECT id, original_url, hash, is_active, created_at, updated_at FROM urls WHERE hash=$1"
	err := repo.DB.QueryRow(query, hash).Scan(&url.ID, &url.OriginalLink, &url.Hash, &url.IsActive, &url.CreatedAt, &url.UpdatedAt)
	return url, err
}

func (repo *LinkRepository) Get(fields []string, pagination gqmodel.PaginationQuery) (*gqmodel.LinksResult, error) {
	sqlFields := "id,original_url,hash,is_active,created_at,updated_at"
	if len(fields) > 0 {
		sqlFields = strings.Join(fields, ",")
	}

	paginator := utils.NewPaginator(pagination.PerPage, pagination.CurrentPage)

	// instead of select * should select only selected properties by the query
	rows, err := repo.DB.Query(fmt.Sprintf("SELECT %s FROM urls LIMIT $1 OFFSET $2", sqlFields), paginator.Limit(), paginator.Offset())
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Create a slice to hold the results
	var urls []*gqmodel.Link

	// Iterate over the rows and populate the slice
	for rows.Next() {
		var url gqmodel.Link
		// Scan based on requested fields
		err := repo.scanToFields(rows, &url, strings.Split(sqlFields, ",")...)
		if err != nil {
			return nil, err
		}
		urls = append(urls, &url)
	}

	// Check for errors from iterating over rows.
	if err = rows.Err(); err != nil {
		return nil, err
	}

	var total int
	err = repo.DB.QueryRow("SELECT count(*) FROM urls").Scan(&total)
	if err != nil {
		return nil, err
	}

	return &gqmodel.LinksResult{
		Data: urls,
		Meta: paginator.BuildMeta(total),
	}, nil
}

func (repo *LinkRepository) scanToFields(rows *sql.Rows, url *gqmodel.Link, fields ...string) error {
	values := make([]interface{}, len(fields))
	for i, field := range fields {
		switch field {
		case "id":
			values[i] = &url.ID
		case "original_url":
			values[i] = &url.OriginalLink
		case "hash":
			values[i] = &url.Hash
		case "created_at":
			values[i] = &url.CreatedAt
		case "is_active":
			values[i] = &url.IsActive
		case "updated_at":
			values[i] = &url.UpdatedAt
		}
	}
	return rows.Scan(values...)
}
