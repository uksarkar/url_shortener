package service

import (
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
	domain := gqmodel.Domain{
		ID:         id,
		IsActive:   input.IsActive,
		Host:       input.Host,
		ForceHTTPS: input.ForceHTTPS,
		UpdatedAt:  time.Now().String(),
	}

	err := s.Repo.UpdateById(id, &domain)

	if err != nil {
		return nil, err
	}

	return &domain, nil
}

func (s *DomainService) Delete(id int) (string, error) {
	err := s.Repo.DeleteById(id)
	return "Domain deleted", err
}
