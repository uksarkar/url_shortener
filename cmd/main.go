package main

import (
	"log"
	"net/http"
	"url-shortener/internal/graph"
	gq_resolver "url-shortener/internal/graph/resolvers"
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

	// Repos
	linkRepo := repository.NewLinkRepository(database)
	domainRepo := repository.NewDomainRepository(database)
	userRepo := repository.NewUserRepository(database)

	// services
	linkService := service.NewLinkService(linkRepo)
	domainService := service.NewDomainService(domainRepo)
	userService := service.NewUserService(userRepo)

	// resolver
	resolver := gq_resolver.Resolver{
		LinkService:   linkService,
		DomainService: domainService,
		UserService:   userService,
	}

	srv := gqlhandler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &resolver}))

	http.Handle("/playground", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Println("Server started at :8080")
	http.ListenAndServe(":8080", nil)
}
