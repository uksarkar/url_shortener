package service

import (
	"errors"
	"time"
	"url-shortener/internal/graph/gqmodel"
	"url-shortener/internal/repository"
	"url-shortener/internal/utils"
)

type UserService struct {
	Repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{Repo: repo}
}

func (s *UserService) Create(input gqmodel.CreateUser) (*gqmodel.User, error) {
	err := utils.ValidateCreateUser(&input)
	if err != nil {
		return nil, err
	}

	user, err := s.Repo.Save(input)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *UserService) Update(id int, input gqmodel.CreateUser) (*gqmodel.User, error) {
	exists, err := s.Repo.ExistsId(id)
	if err != nil {
		return nil, err
	}

	if !exists {
		return nil, errors.New("user not found")
	}

	err = utils.ValidateCreateUser(&input)
	if err != nil {
		return nil, err
	}

	user := gqmodel.User{
		ID:        id,
		IsActive:  input.IsActive,
		Name:      input.Name,
		Email:     input.Email,
		UpdatedAt: time.Now().Format(time.RFC3339),
	}

	err = s.Repo.UpdateById(id, &user)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *UserService) Delete(id int) (string, error) {
	exists, err := s.Repo.ExistsId(id)
	if err != nil {
		return "", err
	}

	if !exists {
		return "", errors.New("user not found")
	}

	err = s.Repo.DeleteById(id)
	return "User deleted", err
}
