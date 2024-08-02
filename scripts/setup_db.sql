CREATE DATABASE url_shortener;

\c url_shortener;

CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    hash TEXT NOT NULL UNIQUE,
    domain_id int DEFAULT NULL,
    is_active boolean NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);
