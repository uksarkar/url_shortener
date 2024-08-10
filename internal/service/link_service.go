package service

import (
	"crypto/sha1"
	"encoding/hex"
	"strings"
	"time"
	"url-shortener/internal/graph/gqmodel"
	"url-shortener/internal/repository"
)

type LinkService struct {
	Repo *repository.LinkRepository
}

func NewLinkService(repo *repository.LinkRepository) *LinkService {
	return &LinkService{Repo: repo}
}

func (s *LinkService) Create(input gqmodel.CreateLink) (*gqmodel.Link, error) {
	var hash string
	if input.Hash == nil || *input.Hash == "" || strings.TrimSpace(*input.Hash) == "" {
		hasher := sha1.New()
		hasher.Write([]byte(strings.Join([]string{input.OriginalLink, time.Now().String()}, "|")))
		hash = hex.EncodeToString(hasher.Sum(nil))[:8]
	} else {
		hash = *input.Hash
	}

	url := gqmodel.Link{
		OriginalLink: input.OriginalLink,
		Hash:         hash,
		DomainID:     input.DomainID,
		IsActive:     true,
	}

	err := s.Repo.Save(url)
	if err != nil {
		return &url, err
	}

	return &url, nil
}
