import { createSignal } from "solid-js";
import { Direction } from "~/interfaces/SortBy";


export default function <T>(defaultDirection: Direction, defaultColumn: keyof T) {
  const [direction, setDirection] = createSignal<Direction>(defaultDirection);
  const [column, setColumn] = createSignal<keyof T>(defaultColumn);

  return {
    direction,
    column,
    setDirection,
    setColumn,
    changeSorting: (direction: Direction, sortColumn: keyof T) => {
        setDirection(direction);
        setColumn(() => sortColumn);
    },
    toggleSorting: () => {
        setDirection(dir => dir === "ASC" ? "DESC":"ASC");
    },
    isAsc: () => direction() === "ASC",
  };
}
