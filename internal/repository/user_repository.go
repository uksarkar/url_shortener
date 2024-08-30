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
	err := repo.DB.QueryRow(query, id).Scan(&user.ID, &user.IsActive, &user.Email, &user.Name, &user.IsActive, &user.CreatedAt, &user.UpdatedAt)
	return &user, err
}

func (r *UserRepository) UpdateById(id int, user *gqmodel.User) error {
	query := `UPDATE users
				SET is_active = $1,
					name = $2,
					email = $3,
					is_admin = $4,
					updated_at = $5
				WHERE id = $6
					AND deleted_at IS NULL`
	_, err := r.DB.Exec(query, user.IsActive, user.Name, user.Email, user.IsAdmin, user.UpdatedAt, id)
	return err
}

func (r *UserRepository) ExistsId(id int) (bool, error) {
	return ExistsId(r.DB, "users", id)
}

func (r *UserRepository) DeleteById(id int) error {
	_, err := r.DB.Exec("UPDATE users SET deleted_at = now() WHERE id = $1 AND deleted_at IS NULL", id)
	return err
}

func (repo *UserRepository) Get(fields []string, pagination gqmodel.PaginationQuery, sort *gqmodel.SortBy, searchTerm *string) (*gqmodel.UserResult, error) {
	sqlFields := "id,name,email,is_admin,is_active,created_at,updated_at"
	if len(fields) > 0 {
		sqlFields = strings.Join(fields, ",")
	}

	paginator := utils.NewPaginator(pagination.PerPage, pagination.CurrentPage)
	ordering := utils.PrepareSortBy(sort)

	if !strings.Contains(sqlFields, *ordering.Column) {
		column := "id"
		ordering.Column = &column
	}

	baseQuery := "FROM users WHERE deleted_at IS NULL"
	args := 1
	term := ""

	if searchTerm != nil && strings.TrimSpace(*searchTerm) != "" {
		term = fmt.Sprintf("%%%s%%", strings.TrimSpace(*searchTerm))
		baseQuery = fmt.Sprintf("%s AND (email ILIKE $%d OR name ILIKE $%d)", baseQuery, args, args+1)
		args += 2
	}

	q := fmt.Sprintf(
		"SELECT %s %s ORDER BY %s %s LIMIT $%d OFFSET $%d",
		sqlFields,
		baseQuery,
		*ordering.Column,
		*ordering.Direction,
		args,
		args+1,
	)
	args += 2

	var rows *sql.Rows
	var err error
	if term != "" {
		rows, err = repo.DB.Query(
			q,
			term,
			term,
			paginator.Limit(),
			paginator.Offset(),
		)
	} else {
		rows, err = repo.DB.Query(
			q,
			paginator.Limit(),
			paginator.Offset(),
		)
	}

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

	if term != "" {
		err = repo.DB.QueryRow(fmt.Sprintf("SELECT count(*) %s", baseQuery), term, term).Scan(&total)
	} else {
		err = repo.DB.QueryRow(fmt.Sprintf("SELECT count(*) %s", baseQuery)).Scan(&total)
	}

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
		case "email":
			values[i] = &user.Email
		case "is_admin":
			values[i] = &user.IsAdmin
		case "is_active":
			values[i] = &user.IsActive
		case "created_at":
			values[i] = &user.CreatedAt
		case "updated_at":
			values[i] = &user.UpdatedAt
		}
	}
	return rows.Scan(values...)
}
