package repository

import (
	"database/sql"
	"fmt"
	"strings"
	"url-shortener/internal/graph/gqmodel"
)

type URLRepository struct {
	DB *sql.DB
}

func NewURLRepository(db *sql.DB) *URLRepository {
	return &URLRepository{DB: db}
}

func (repo *URLRepository) Save(url gqmodel.URL) error {
	query := "INSERT INTO urls (original_url, hash, domain_id, is_active) VALUES ($1, $2, $3, $4)"
	_, err := repo.DB.Exec(query, url.OriginalURL, url.Hash, url.DomainID, url.IsActive)
	return err
}

func (repo *URLRepository) Find(id int) (*gqmodel.URL, error) {
	var url gqmodel.URL
	query := "SELECT id, original_url, hash, is_active, created_at, updated_at FROM urls WHERE id=$1"
	err := repo.DB.QueryRow(query, id).Scan(&url.ID, &url.OriginalURL, &url.Hash, &url.IsActive, &url.CreatedAt, &url.UpdatedAt)
	return &url, err
}

func (repo *URLRepository) FindByHash(hash string) (gqmodel.URL, error) {
	var url gqmodel.URL
	query := "SELECT id, original_url, hash, is_active, created_at, updated_at FROM urls WHERE hash=$1"
	err := repo.DB.QueryRow(query, hash).Scan(&url.ID, &url.OriginalURL, &url.Hash, &url.IsActive, &url.CreatedAt, &url.UpdatedAt)
	return url, err
}

func (repo *URLRepository) Get(fields []string) ([]*gqmodel.URL, error) {
	sqlFields := "id,original_url,hash,is_active,created_at,updated_at"
	if len(fields) > 0 {
		sqlFields = strings.Join(fields, ",")
	}

	// instead of select * should select only selected properties by the query
	rows, err := repo.DB.Query(fmt.Sprintf("SELECT %s FROM urls LIMIT 10", sqlFields))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Create a slice to hold the results
	var urls []*gqmodel.URL

	// Iterate over the rows and populate the slice
	for rows.Next() {
		var url gqmodel.URL
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

	return urls, nil
}

func (repo *URLRepository) scanToFields(rows *sql.Rows, url *gqmodel.URL, fields ...string) error {
	values := make([]interface{}, len(fields))
	for i, field := range fields {
		switch field {
		case "id":
			values[i] = &url.ID
		case "original_url":
			values[i] = &url.OriginalURL
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
