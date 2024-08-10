CREATE DATABASE url_shortener;

\c url_shortener;

CREATE TABLE links (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    original_url TEXT NOT NULL,
    hash TEXT NOT NULL UNIQUE,
    domain_id int DEFAULT NULL,
    is_active boolean NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX links_created_at_idx ON links(created_at);
CREATE INDEX links_updated_at_idx ON links(updated_at);
CREATE INDEX links_deleted_at_idx ON links(deleted_at);
CREATE INDEX links_is_active_idx ON links(is_active);
CREATE INDEX links_domain_id_idx ON links(domain_id);

CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    is_active boolean NOT NULL DEFAULT TRUE,
    is_admin boolean NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX users_created_at_idx ON users(created_at);
CREATE INDEX users_updated_at_idx ON users(updated_at);
CREATE INDEX users_deleted_at_idx ON users(deleted_at);
CREATE INDEX users_is_active_idx ON users(is_active);
CREATE INDEX users_is_admin_idx ON users(is_admin);

CREATE TABLE domains (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    is_active boolean NOT NULL DEFAULT TRUE,
    force_https boolean NOT NULL DEFAULT TRUE,
    host TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX domains_created_at_idx ON domains(created_at);
CREATE INDEX domains_updated_at_idx ON domains(updated_at);
CREATE INDEX domains_deleted_at_idx ON domains(deleted_at);
CREATE INDEX domains_is_active_idx ON domains(is_active);