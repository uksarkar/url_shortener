export default interface SortBy<T = string> {
    column?: T;
    direction: "asc" | "desc"
}