export default interface CreateLink {
  is_active?: boolean;
  hash?: string;
  original_link: string;
  domain_id?: number;
}
