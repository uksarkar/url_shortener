// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package gqmodel

type CreateDomain struct {
	IsActive   bool   `json:"is_active"`
	ForceHTTPS bool   `json:"force_https"`
	Host       string `json:"host"`
}

type CreateLink struct {
	OriginalLink string  `json:"original_link"`
	IsActive     bool    `json:"is_active"`
	Hash         *string `json:"hash,omitempty"`
	DomainID     *int    `json:"domain_id,omitempty"`
}

type CreateUser struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	IsActive bool   `json:"is_active"`
	IsAdmin  *bool  `json:"is_admin,omitempty"`
}

type Domain struct {
	ID         int     `json:"id"`
	IsActive   bool    `json:"is_active"`
	Host       string  `json:"host"`
	ForceHTTPS bool    `json:"force_https"`
	CreatedAt  string  `json:"created_at"`
	UpdatedAt  string  `json:"updated_at"`
	DeletedAt  *string `json:"deleted_at,omitempty"`
}

type DomainsResult struct {
	Data []*Domain       `json:"data"`
	Meta *PaginationMeta `json:"meta"`
}

type Link struct {
	ID           int    `json:"id"`
	OriginalLink string `json:"original_link"`
	Hash         string `json:"hash"`
	DomainID     *int   `json:"domain_id,omitempty"`
	IsActive     bool   `json:"is_active"`
	CreatedAt    string `json:"created_at"`
	UpdatedAt    string `json:"updated_at"`
}

type LinksResult struct {
	Data []*Link         `json:"data"`
	Meta *PaginationMeta `json:"meta"`
}

type Mutation struct {
}

type PaginationMeta struct {
	PerPage     int  `json:"per_page"`
	CurrentPage int  `json:"current_page"`
	Total       int  `json:"total"`
	Pages       int  `json:"pages"`
	Next        *int `json:"next,omitempty"`
	Prev        *int `json:"prev,omitempty"`
}

type PaginationQuery struct {
	PerPage     int `json:"per_page"`
	CurrentPage int `json:"current_page"`
}

type Query struct {
}

type SortBy struct {
	Column    *string `json:"column,omitempty"`
	Direction *string `json:"direction,omitempty"`
}

type User struct {
	ID        int     `json:"id"`
	Name      string  `json:"name"`
	Email     string  `json:"email"`
	IsActive  bool    `json:"is_active"`
	IsAdmin   bool    `json:"is_admin"`
	CreatedAt string  `json:"created_at"`
	UpdatedAt string  `json:"updated_at"`
	DeletedAt *string `json:"deleted_at,omitempty"`
}

type UserResult struct {
	Data []*User         `json:"data"`
	Meta *PaginationMeta `json:"meta"`
}
