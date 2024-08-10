package repository

import (
	"database/sql"
	"fmt"
	"strings"
	"url-shortener/internal/graph/gqmodel"
	"url-shortener/internal/utils"
)

type DomainRepository struct {
	DB *sql.DB
}

func NewDomainRepository(db *sql.DB) *DomainRepository {
	return &DomainRepository{DB: db}
}

func (repo *DomainRepository) Save(domain gqmodel.CreateDomain) (gqmodel.Domain, error) {
	result := gqmodel.Domain{
		Host:       domain.Host,
		IsActive:   domain.IsActive,
		ForceHTTPS: domain.ForceHTTPS,
	}

	query := "INSERT INTO domains (is_active, host, force_https) VALUES ($1, $2, $3) RETURNING id, created_at, updated_at"
	err := repo.DB.QueryRow(query, domain.IsActive, domain.Host, domain.ForceHTTPS).Scan(&result.ID, &result.CreatedAt, &result.UpdatedAt)

	return result, err
}

func (repo *DomainRepository) Find(id int) (*gqmodel.Domain, error) {
	var domain gqmodel.Domain
	query := "SELECT id, is_active, host, force_https, created_at, updated_at FROM domains WHERE id=$1 AND deleted_at IS NULL"
	err := repo.DB.QueryRow(query, id).Scan(&domain.ID, &domain.IsActive, &domain.Host, &domain.ForceHTTPS, &domain.CreatedAt, &domain.UpdatedAt)
	return &domain, err
}

func (r *DomainRepository) UpdateById(id int, domain *gqmodel.Domain) error {
	query := "UPDATE domains (is_active, host, force_https, updated_at) VALUES ($1, $2, $3, $4) WHERE id = $5 AND deleted_at IS NULL"
	_, err := r.DB.Exec(query, domain.IsActive, domain.Host, domain.ForceHTTPS, domain.UpdatedAt, id)
	return err
}

func (r *DomainRepository) DeleteById(id int) error {
	_, err := r.DB.Exec("UPDATE domains SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL", id)
	return err
}

func (repo *DomainRepository) Get(fields []string, pagination gqmodel.PaginationQuery, sort *gqmodel.SortBy) (*gqmodel.DomainsResult, error) {
	sqlFields := "id,host,force_https,is_active,created_at,updated_at"
	if len(fields) > 0 {
		sqlFields = strings.Join(fields, ",")
	}

	paginator := utils.NewPaginator(pagination.PerPage, pagination.CurrentPage)
	ordering := utils.PrepareSortBy(sort)

	// instead of select * should select only selected properties by the query
	rows, err := repo.DB.Query(
		fmt.Sprintf("SELECT %s FROM domains WHERE deleted_at IS NULL ORDER BY $1 %s LIMIT $2 OFFSET $3", sqlFields, *ordering.Direction),
		ordering.Column,
		paginator.Limit(),
		paginator.Offset(),
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Create a slice to hold the results
	var domains []*gqmodel.Domain

	// Iterate over the rows and populate the slice
	for rows.Next() {
		var domain gqmodel.Domain
		// Scan based on requested fields
		err := repo.scanToFields(rows, &domain, strings.Split(sqlFields, ",")...)
		if err != nil {
			return nil, err
		}
		domains = append(domains, &domain)
	}

	// Check for errors from iterating over rows.
	if err = rows.Err(); err != nil {
		return nil, err
	}

	var total int
	err = repo.DB.QueryRow("SELECT count(*) FROM domains WHERE deleted_at IS NULL").Scan(&total)
	if err != nil {
		return nil, err
	}

	return &gqmodel.DomainsResult{
		Data: domains,
		Meta: paginator.BuildMeta(total),
	}, nil
}

func (repo *DomainRepository) scanToFields(rows *sql.Rows, domain *gqmodel.Domain, fields ...string) error {
	values := make([]interface{}, len(fields))
	for i, field := range fields {
		switch field {
		case "id":
			values[i] = &domain.ID
		case "host":
			values[i] = &domain.Host
		case "force_https":
			values[i] = &domain.ForceHTTPS
		case "created_at":
			values[i] = &domain.CreatedAt
		case "is_active":
			values[i] = &domain.IsActive
		case "updated_at":
			values[i] = &domain.UpdatedAt
		}
	}
	return rows.Scan(values...)
}
