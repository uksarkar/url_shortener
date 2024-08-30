export default interface CreateUser {
    name: string;
    email: string;
    is_active: boolean;
    is_admin?: boolean;
}