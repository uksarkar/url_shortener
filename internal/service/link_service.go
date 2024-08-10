package service

import (
	"crypto/sha1"
	"encoding/hex"
	"errors"
	"strings"
	"time"
	"url-shortener/internal/graph/gqmodel"
	"url-shortener/internal/repository"
	"url-shortener/internal/utils"
)

type LinkService struct {
	Repo *repository.LinkRepository
}

func NewLinkService(repo *repository.LinkRepository) *LinkService {
	return &LinkService{Repo: repo}
}

func (s *LinkService) Create(input gqmodel.CreateLink) (*gqmodel.Link, error) {
	err := utils.ValidateCreateLink(&input)
	if err != nil {
		return nil, err
	}

	hash := parseHash(input.Hash, input.OriginalLink)

	url := gqmodel.Link{
		OriginalLink: input.OriginalLink,
		Hash:         hash,
		DomainID:     input.DomainID,
		IsActive:     input.IsActive,
	}

	err = s.Repo.Save(url)
	if err != nil {
		return &url, err
	}

	return &url, nil
}

func (s *LinkService) Update(id int, input gqmodel.CreateLink) (*gqmodel.Link, error) {
	exists, err := s.Repo.ExistsId(id)
	if err != nil {
		return nil, err
	}

	if !exists {
		return nil, errors.New("link not found")
	}

	err = utils.ValidateCreateLink(&input)
	if err != nil {
		return nil, err
	}

	hash := parseHash(input.Hash, input.OriginalLink)

	domain := gqmodel.Link{
		ID:           id,
		OriginalLink: input.OriginalLink,
		DomainID:     input.DomainID,
		Hash:         hash,
		IsActive:     input.IsActive,
		UpdatedAt:    time.Now().Format(time.RFC3339),
	}

	err = s.Repo.UpdateById(id, &domain)

	if err != nil {
		return nil, err
	}

	return &domain, nil
}

func (s *LinkService) Delete(id int) (string, error) {
	exists, err := s.Repo.ExistsId(id)
	if err != nil {
		return "", err
	}

	if !exists {
		return "", errors.New("link not found")
	}

	err = s.Repo.DeleteById(id)
	return "Link deleted", err
}

func parseHash(inputHash *string, link string) string {
	var hash string
	if inputHash == nil || *inputHash == "" || strings.TrimSpace(*inputHash) == "" {
		hasher := sha1.New()
		hasher.Write([]byte(strings.Join([]string{link, time.Now().String()}, "|")))
		hash = hex.EncodeToString(hasher.Sum(nil))[:8]
	} else {
		hash = *inputHash
	}

	return hash
}
