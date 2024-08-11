import { For } from "solid-js";
import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export default function TableCellSkeleton({ cols }: { cols: number }) {
  return (
    <TableRow>
      <For each={Array(cols).fill(0)}>
        {() => (
          <TableCell>
            <Skeleton height={16} radius={10} />
          </TableCell>
        )}
      </For>
    </TableRow>
  );
}
