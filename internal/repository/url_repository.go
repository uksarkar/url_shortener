package repository

import (
	"database/sql"
	"url-shortener/internal/model"
)

type URLRepository struct {
	DB *sql.DB
}

func NewURLRepository(db *sql.DB) *URLRepository {
	return &URLRepository{DB: db}
}

func (repo *URLRepository) Save(url model.URL) error {
	query := "INSERT INTO urls (original_url, short_url) VALUES ($1, $2)"
	_, err := repo.DB.Exec(query, url.OriginalURL, url.ShortURL)
	return err
}

func (repo *URLRepository) FindByShortURL(shortURL string) (model.URL, error) {
	var url model.URL
	query := "SELECT id, original_url, short_url, created_at FROM urls WHERE short_url=$1"
	err := repo.DB.QueryRow(query, shortURL).Scan(&url.ID, &url.OriginalURL, &url.ShortURL, &url.CreatedAt)
	return url, err
}
