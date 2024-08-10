package service

import (
	"errors"
	"time"
	"url-shortener/internal/graph/gqmodel"
	"url-shortener/internal/repository"
	"url-shortener/internal/utils"
)

type DomainService struct {
	Repo *repository.DomainRepository
}

func NewDomainService(repo *repository.DomainRepository) *DomainService {
	return &DomainService{Repo: repo}
}

func (s *DomainService) Create(input gqmodel.CreateDomain) (*gqmodel.Domain, error) {
	err := utils.ValidateCreateDomain(&input)
	if err != nil {
		return nil, err
	}

	domain, err := s.Repo.Save(input)
	if err != nil {
		return nil, err
	}

	return &domain, nil
}

func (s *DomainService) Update(id int, input gqmodel.CreateDomain) (*gqmodel.Domain, error) {
	exists, err := s.Repo.ExistsId(id)
	if err != nil {
		return nil, err
	}

	if !exists {
		return nil, errors.New("domain not found")
	}

	domain := gqmodel.Domain{
		ID:         id,
		IsActive:   input.IsActive,
		Host:       input.Host,
		ForceHTTPS: input.ForceHTTPS,
		UpdatedAt:  time.Now().Format(time.RFC3339),
	}

	err = s.Repo.UpdateById(id, &domain)

	if err != nil {
		return nil, err
	}

	return &domain, nil
}

func (s *DomainService) Delete(id int) (string, error) {
	exists, err := s.Repo.ExistsId(id)
	if err != nil {
		return "", err
	}

	if !exists {
		return "", errors.New("domain not found")
	}

	err = s.Repo.DeleteById(id)
	return "Domain deleted", err
}
