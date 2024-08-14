export type Direction = "DESC" | "ASC";

export default interface SortBy<T = string> {
    column?: T;
    direction: Direction;
}