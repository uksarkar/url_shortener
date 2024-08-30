import { gql } from "graphql-request";
import User from "~/interfaces/User";
import { PaginatedResponse } from "~/interfaces/PaginatedResponse";
import SortBy from "~/interfaces/SortBy";
import { client } from "~/lib/graphql-client";
import CreateUser from "~/interfaces/CreateUser";

export async function getUsers(
  per_page: number,
  current_page: number,
  sort?: SortBy<keyof User>,
  q?: string
) {
  const QUERY = gql`
    query GetUsers($pagination: PaginationQuery!, $sort: SortBy, $q: String) {
      users(pagination: $pagination, sort: $sort, q: $q) {
        data {
          id
          name
          email
          is_admin
          is_active
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
      },
      sort,
      q
    }
  );

  return response.users;
}

export async function createUser(input: CreateUser) {
  const MUTATION = gql`
    mutation CreateUser($input: CreateUser!) {
      createUser(input: $input) {
        id
        name
        email
        is_admin
        is_active
        created_at
        updated_at
      }
    }
  `;

  const response = await client.request<{ createUser: User }>(MUTATION, {
    input
  });

  return response.createUser;
}

export async function updateUser(id: number, input: CreateUser) {
  const MUTATION = gql`
    mutation UpdateUser($id: Int!, $input: CreateUser!) {
      updateUser(id: $id, input: $input) {
        id
        name
        email
        is_admin
        is_active
        updated_at
      }
    }
  `;

  const response = await client.request<{
    updateUser: Omit<User, "created_at">;
  }>(MUTATION, {
    id,
    input
  });

  return response.updateUser;
}

export async function deleteUser(id: number) {
  const MUTATION = gql`
    mutation UpdateUser($id: Int!) {
      deleteUser(id: $id)
    }
  `;

  const response = await client.request<{
    deleteUser: string;
  }>(MUTATION, {
    id
  });

  return response.deleteUser;
}
