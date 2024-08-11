import { Flex } from "../ui/flex";
import { TableCell, TableRow } from "../ui/table";
import Loader from "./loader";
import TableCellSkeleton from "./tablecell-skeleton";

export default function TableLoader({ cols }: { cols: number }) {
  return (
    <>
      <TableCellSkeleton cols={cols} />
      <TableRow>
        <TableCell colSpan={cols}>
          <Flex justifyContent="center">
            <Loader />
          </Flex>
        </TableCell>
      </TableRow>
    </>
  );
}
