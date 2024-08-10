export default interface Link {
  id: number;
  original_link: string;
  hash: string;
  domain_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
