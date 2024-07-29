package main

import (
	"log"
	"net/http"
	"url-shortener/internal/graph"
	"url-shortener/internal/handler"
	"url-shortener/internal/repository"
	"url-shortener/internal/service"
	"url-shortener/pkg/db"

	gqlhandler "github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

func main() {
	database, err := db.Connect()
	if err != nil {
		log.Fatal(err)
	}

	defer database.Close()

	urlRepo := repository.NewURLRepository(database)
	urlService := service.NewURLService(urlRepo)
	urlHandler := handler.NewURLHandler(urlService)

	http.HandleFunc("/shorten", urlHandler.ShortenURL)
	http.HandleFunc("/original", urlHandler.GetOriginalURL)

	srv := gqlhandler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{URLService: urlService}}))

	http.Handle("/playground", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Println("Server started at :8080")
	http.ListenAndServe(":8080", nil)
}
