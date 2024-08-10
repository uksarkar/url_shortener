export interface PaginatedMeta {
  current_page: number;
  per_page: number;
  total: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}
