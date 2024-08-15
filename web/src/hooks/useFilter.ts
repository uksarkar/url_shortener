import { useSearchParams } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import { toNumber } from "~/lib/utils";
import useSorting from "./useSorting";
import { Direction } from "~/interfaces/SortBy";

export default function useFilter<T>(options: {
  page?: number;
  perPage?: number;
  q?: string;
  defaultDirection: Direction;
  defaultColumn: keyof T;
}) {
  const [search, setSearch] = useSearchParams();
  const [page, setPage] = createSignal(
    toNumber(search.page, options.page || 1)
  );
  const [q, setQ] = createSignal<string>(
    decodeURIComponent(search.q || options.q || "")
  );
  const [perPage, setPerPage] = createSignal(
    toNumber(search.perPage, options.perPage || 10)
  );
  const { column, direction, toggleSorting, isAsc } = useSorting<T>(
    options.defaultDirection,
    options.defaultColumn
  );

  createEffect(() => {
    setSearch({
      page: page(),
      perPage: perPage(),
      q: encodeURIComponent(q()),
      order: column() as string,
      direction: direction()
    });
  });

  return {
    // accessors
    q,
    page,
    perPage,
    column,
    direction,
    isAsc,

    // mutation
    setPage,
    setPerPage,
    setQ,
    toggleSorting
  };
}
