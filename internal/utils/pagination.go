package utils

import (
	"math"
	"url-shortener/internal/graph/gqmodel"
)

type Paginator struct {
	PerPage     int
	CurrentPage int
}

func NewPaginator(perPage int, currentPage int) Paginator {
	return Paginator{
		PerPage:     max(min(perPage, 100), 10),
		CurrentPage: max(currentPage, 1),
	}
}

func (p *Paginator) Limit() int {
	return p.PerPage
}

func (p *Paginator) Offset() int {
	return (p.CurrentPage - 1) * p.PerPage
}

func (p *Paginator) BuildMeta(total int) *gqmodel.PaginationMeta {
	meta := gqmodel.PaginationMeta{
		PerPage:     p.PerPage,
		CurrentPage: p.CurrentPage,
		Total:       total,
	}

	totalPage := 0

	if total > 0 {
		totalPage = int(math.Ceil(float64(total) / float64(p.PerPage)))
	}

	meta.Pages = totalPage

	// Handle Next page
	if p.CurrentPage+1 <= totalPage {
		nextPage := p.CurrentPage + 1
		meta.Next = &nextPage
	}

	// Handle Previous page
	if p.CurrentPage-1 > 0 {
		prevPage := p.CurrentPage - 1
		meta.Prev = &prevPage
	}

	return &meta
}
