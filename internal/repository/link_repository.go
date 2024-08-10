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

func (repo *LinkRepository) Save(link gqmodel.Link) error {
	query := "INSERT INTO links (original_link, hash, domain_id, is_active) VALUES ($1, $2, $3, $4)"
	_, err := repo.DB.Exec(query, link.OriginalLink, link.Hash, link.DomainID, link.IsActive)
	return err
}

func (repo *LinkRepository) Find(id int) (*gqmodel.Link, error) {
	var link gqmodel.Link
	query := "SELECT id, original_link, hash, is_active, created_at, updated_at FROM links WHERE id=$1 AND deleted_at IS NULL"
	err := repo.DB.QueryRow(query, id).Scan(&link.ID, &link.OriginalLink, &link.Hash, &link.IsActive, &link.CreatedAt, &link.UpdatedAt)
	return &link, err
}

func (repo *LinkRepository) FindByHash(hash string) (gqmodel.Link, error) {
	var link gqmodel.Link
	query := "SELECT id, original_link, hash, is_active, created_at, updated_at FROM links WHERE hash=$1 AND deleted_at IS NULL"
	err := repo.DB.QueryRow(query, hash).Scan(&link.ID, &link.OriginalLink, &link.Hash, &link.IsActive, &link.CreatedAt, &link.UpdatedAt)
	return link, err
}

func (r *LinkRepository) UpdateById(id int, link *gqmodel.Link) error {
	query := `UPDATE links
			SET original_link = $1,
				hash = $2,
				domain_id = $3,
				is_active = $4,
				updated_at = $5
			WHERE id = $6
				AND deleted_at IS NULL`
	_, err := r.DB.Exec(query, link.OriginalLink, link.Hash, link.DomainID, link.IsActive, link.UpdatedAt, id)
	return err
}

func (r *LinkRepository) ExistsId(id int) (bool, error) {
	return ExistsId(r.DB, "links", id)
}

func (r *LinkRepository) DeleteById(id int) error {
	_, err := r.DB.Exec("UPDATE links SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL", id)
	return err
}

func (repo *LinkRepository) Get(fields []string, pagination gqmodel.PaginationQuery, sort *gqmodel.SortBy) (*gqmodel.LinksResult, error) {
	sqlFields := "id,original_link,hash,is_active,created_at,updated_at"
	if len(fields) > 0 {
		sqlFields = strings.Join(fields, ",")
	}

	paginator := utils.NewPaginator(pagination.PerPage, pagination.CurrentPage)
	ordering := utils.PrepareSortBy(sort)

	// instead of select * should select only selected properties by the query
	rows, err := repo.DB.Query(
		fmt.Sprintf("SELECT %s FROM links WHERE deleted_at IS NULL ORDER BY $1 %s LIMIT $2 OFFSET $3", sqlFields, *ordering.Direction),
		ordering.Column,
		paginator.Limit(),
		paginator.Offset(),
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Create a slice to hold the results
	var links []*gqmodel.Link

	// Iterate over the rows and populate the slice
	for rows.Next() {
		var link gqmodel.Link
		// Scan based on requested fields
		err := repo.scanToFields(rows, &link, strings.Split(sqlFields, ",")...)
		if err != nil {
			return nil, err
		}
		links = append(links, &link)
	}

	// Check for errors from iterating over rows.
	if err = rows.Err(); err != nil {
		return nil, err
	}

	var total int
	err = repo.DB.QueryRow("SELECT count(*) FROM links WHERE deleted_at IS NULL").Scan(&total)
	if err != nil {
		return nil, err
	}

	return &gqmodel.LinksResult{
		Data: links,
		Meta: paginator.BuildMeta(total),
	}, nil
}

func (repo *LinkRepository) scanToFields(rows *sql.Rows, link *gqmodel.Link, fields ...string) error {
	values := make([]interface{}, len(fields))
	for i, field := range fields {
		switch field {
		case "id":
			values[i] = &link.ID
		case "original_link":
			values[i] = &link.OriginalLink
		case "hash":
			values[i] = &link.Hash
		case "domain_id":
			values[i] = &link.DomainID
		case "created_at":
			values[i] = &link.CreatedAt
		case "is_active":
			values[i] = &link.IsActive
		case "updated_at":
			values[i] = &link.UpdatedAt
		}
	}
	return rows.Scan(values...)
}
