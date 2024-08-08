package service

import (
	"crypto/sha1"
	"encoding/hex"
	"strings"
	"time"
	"url-shortener/internal/graph/gqmodel"
	"url-shortener/internal/repository"
)

type URLService struct {
	Repo *repository.URLRepository
}

func NewURLService(repo *repository.URLRepository) *URLService {
	return &URLService{Repo: repo}
}

func (s *URLService) Create(input gqmodel.ShortenURL) (*gqmodel.URL, error) {
	var hash string
	if input.Hash == nil || *input.Hash == "" || strings.TrimSpace(*input.Hash) == "" {
		hasher := sha1.New()
		hasher.Write([]byte(strings.Join([]string{input.OriginalURL, time.Now().String()}, "|")))
		hash = hex.EncodeToString(hasher.Sum(nil))[:8]
	} else {
		hash = *input.Hash
	}

	url := gqmodel.URL{
		OriginalURL: input.OriginalURL,
		Hash:        hash,
		DomainID:    input.DomainID,
		IsActive:    true,
	}

	err := s.Repo.Save(url)
	if err != nil {
		return &url, err
	}

	return &url, nil
}
