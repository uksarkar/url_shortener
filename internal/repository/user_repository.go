package repository

import (
	"database/sql"
	"fmt"
	"strings"
	"url-shortener/internal/graph/gqmodel"
	"url-shortener/internal/utils"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (repo *UserRepository) Save(user gqmodel.CreateUser) (gqmodel.User, error) {
	isAdmin := false

	if user.IsAdmin != nil {
		isAdmin = *user.IsAdmin
	}

	result := gqmodel.User{
		IsActive: user.IsActive,
		Name:     user.Name,
		Email:    user.Email,
		IsAdmin:  isAdmin,
	}

	query := "INSERT INTO users (is_active, name, email, is_admin) VALUES ($1, $2, $3, $4) RETURNING id, created_at, updated_at"
	err := repo.DB.QueryRow(query, user.IsActive, user.Name, user.Email, isAdmin).Scan(&result.ID, &result.CreatedAt, &result.UpdatedAt)

	return result, err
}

func (repo *UserRepository) Find(id int) (*gqmodel.User, error) {
	var user gqmodel.User
	query := "SELECT id, is_active, name, email, is_admin, created_at, updated_at FROM users WHERE id=$1 AND deleted_at IS NULL"
	err := repo.DB.QueryRow(query, id).Scan(&user.ID, &user.IsActive, &user.Name, &user.IsActive, &user.CreatedAt, &user.UpdatedAt)
	return &user, err
}

func (r *UserRepository) UpdateById(id int, user *gqmodel.User) error {
	query := "UPDATE users (is_active, name, email, is_admin, updated_at) VALUES ($1, $2, $3, $4) WHERE id = $5 AND deleted_at IS NULL"
	_, err := r.DB.Exec(query, user.IsActive, user.Name, user.IsAdmin, user.UpdatedAt, id)
	return err
}

func (r *UserRepository) DeleteById(id int) error {
	_, err := r.DB.Exec("UPDATE users SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL", id)
	return err
}

func (repo *UserRepository) Get(fields []string, pagination gqmodel.PaginationQuery, sort *gqmodel.SortBy) (*gqmodel.UserResult, error) {
	sqlFields := "id,name,is_admin,is_active,created_at,updated_at"
	if len(fields) > 0 {
		sqlFields = strings.Join(fields, ",")
	}

	paginator := utils.NewPaginator(pagination.PerPage, pagination.CurrentPage)
	ordering := utils.PrepareSortBy(sort)

	// instead of select * should select only selected properties by the query
	rows, err := repo.DB.Query(
		fmt.Sprintf("SELECT %s FROM users WHERE deleted_at IS NULL ORDER BY $1 %s LIMIT $2 OFFSET $3", sqlFields, *ordering.Direction),
		ordering.Column,
		paginator.Limit(),
		paginator.Offset(),
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Create a slice to hold the results
	var users []*gqmodel.User

	// Iterate over the rows and populate the slice
	for rows.Next() {
		var user gqmodel.User
		// Scan based on requested fields
		err := repo.scanToFields(rows, &user, strings.Split(sqlFields, ",")...)
		if err != nil {
			return nil, err
		}
		users = append(users, &user)
	}

	// Check for errors from iterating over rows.
	if err = rows.Err(); err != nil {
		return nil, err
	}

	var total int
	err = repo.DB.QueryRow("SELECT count(*) FROM users WHERE deleted_at IS NULL").Scan(&total)
	if err != nil {
		return nil, err
	}

	return &gqmodel.UserResult{
		Data: users,
		Meta: paginator.BuildMeta(total),
	}, nil
}

func (repo *UserRepository) scanToFields(rows *sql.Rows, user *gqmodel.User, fields ...string) error {
	values := make([]interface{}, len(fields))
	for i, field := range fields {
		switch field {
		case "id":
			values[i] = &user.ID
		case "name":
			values[i] = &user.Name
		case "is_admin":
			values[i] = &user.IsAdmin
		case "created_at":
			values[i] = &user.CreatedAt
		case "is_active":
			values[i] = &user.IsActive
		case "updated_at":
			values[i] = &user.UpdatedAt
		}
	}
	return rows.Scan(values...)
}
