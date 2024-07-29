package service

import (
	"crypto/sha1"
	"encoding/hex"
	"url-shortener/internal/model"
	"url-shortener/internal/repository"
)

type URLService struct {
	Repo *repository.URLRepository
}

func NewURLService(repo *repository.URLRepository) *URLService {
	return &URLService{Repo: repo}
}

func (s *URLService) ShortenURL(originalURL string) (string, error) {
	hasher := sha1.New()
	hasher.Write([]byte(originalURL))
	shortURL := hex.EncodeToString(hasher.Sum(nil))[:8]

	url := model.URL{
		OriginalURL: originalURL,
		ShortURL:    shortURL,
	}

	err := s.Repo.Save(url)
	if err != nil {
		return "", err
	}

	return shortURL, nil
}

func (s *URLService) GetOriginalURL(shortURL string) (string, error) {
	url, err := s.Repo.FindByShortURL(shortURL)
	if err != nil {
		return "", err
	}

	return url.OriginalURL, nil
}
