import { gql } from "graphql-request";
import CreateLink from "~/interfaces/CreateLink";
import Link from "~/interfaces/Link";
import { PaginatedResponse } from "~/interfaces/PaginatedResponse";
import SortBy from "~/interfaces/SortBy";
import { client } from "~/lib/graphql-client";

export async function getLinks(
  per_page: number,
  current_page: number,
  sort?: SortBy<keyof Link>
) {
  const QUERY = gql`
    query GetLinks($pagination: PaginationQuery!, $sort: SortBy) {
      links(pagination: $pagination, sort: $sort) {
        data {
          id
          original_link
          hash
          domain_id
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

  const response = await client.request<{ links: PaginatedResponse<Link> }>(
    QUERY,
    {
      pagination: {
        per_page,
        current_page
      },
      sort
    }
  );

  return response.links;
}

export async function shortLink(input: CreateLink) {
  const MUTATION = gql`
    mutation CreateLink($input: CreateLink!) {
      createLink(input: $input) {
        id
        original_link
        hash
        domain_id
        is_active
        created_at
        updated_at
      }
    }
  `;

  const response = await client.request<{ createLink: Link }>(MUTATION, {
    input
  });

  return response.createLink;
}

export async function updateLink(id: number, input: CreateLink) {
  const MUTATION = gql`
    mutation UpdateLink($id: Int!, $input: CreateLink!) {
      updateLink(id: $id, input: $input) {
        id
        original_link
        hash
        domain_id
        is_active
        updated_at
      }
    }
  `;

  const response = await client.request<{
    updateLink: Omit<Link, "created_at">;
  }>(MUTATION, {
    id,
    input
  });

  return response.updateLink;
}
