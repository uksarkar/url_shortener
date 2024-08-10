import { gql } from "graphql-request";
import { PaginatedResponse } from "~/interfaces/PaginatedResponse";
import User from "~/interfaces/User";
import { client } from "~/lib/graphql-client";

export async function getUsers(per_page: number, current_page: number) {
  const QUERY = gql`
    query GetUsers($pagination: PaginationQuery!) {
      users(pagination: $pagination) {
        data {
          id
          name
          email
          is_active
          is_admin
          created_at
          updated_at
        }
        meta {
          current_page
          per_page
          total
          pages
          next
          prev
        }
      }
    }
  `;

  const response = await client.request<{ users: PaginatedResponse<User> }>(
    QUERY,
    {
      pagination: {
        per_page,
        current_page
      }
    }
  );

  return response.users;
}
