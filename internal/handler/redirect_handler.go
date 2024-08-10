package handler

import (
	"url-shortener/internal/service"
)

type RedirectHandler struct {
	Service *service.LinkService
}

func NewRedirectHandler(service *service.LinkService) *RedirectHandler {
	return &RedirectHandler{Service: service}
}

// func (h *URLHandler) ShortenURL(w http.ResponseWriter, r *http.Request) {
// 	var request struct {
// 		OriginalURL string `json:"original_url"`
// 	}

// 	err := json.NewDecoder(r.Body).Decode(&request)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusBadRequest)
// 		return
// 	}

// 	shortURL, err := h.Service.ShortenURL(request.OriginalURL)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	response := struct {
// 		ShortURL string `json:"short_url"`
// 	}{
// 		ShortURL: shortURL,
// 	}

// 	json.NewEncoder(w).Encode(response)
// }

// func (h *URLHandler) GetOriginalURL(w http.ResponseWriter, r *http.Request) {
// 	shortURL := r.URL.Query().Get("short_url")
// 	if shortURL == "" {
// 		http.Error(w, "short_url query parameter is required", http.StatusBadRequest)
// 		return
// 	}

// 	originalURL, err := h.Service.GetOriginalURL(shortURL)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	response := struct {
// 		OriginalURL string `json:"original_url"`
// 	}{
// 		OriginalURL: originalURL,
// 	}

// 	json.NewEncoder(w).Encode(response)
// }
