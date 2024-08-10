import { gql } from "graphql-request";
import Link from "~/interfaces/Link";
import { PaginatedResponse } from "~/interfaces/PaginatedResponse";
import { client } from "~/lib/graphql-client";

export async function getLinks(per_page: number, current_page: number) {
  const QUERY = gql`
    query GetLinks($pagination: PaginationQuery!) {
      links(pagination: $pagination) {
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
      }
    }
  );

  return response.links;
}
