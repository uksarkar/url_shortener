package repository

import (
	"database/sql"
	"fmt"
)

func ExistsId(db *sql.DB, table string, id int) (bool, error) {
	query := fmt.Sprintf(`SELECT EXISTS(
				SELECT 1
				FROM %s
				WHERE id = $1
					AND deleted_at IS NULL
			)`, table)

	exists := false
	err := db.QueryRow(query, id).Scan(&exists)

	return exists, err
}
