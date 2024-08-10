import { createResource } from "solid-js";
import { getUsers } from "~/api/user";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table";

export default function Users() {
  const [data] = createResource(async () => {
    const response = await getUsers(1, 1);
    return response;
  });

  console.log(data());

  return (
    <Table>
      <TableCaption>
        {data.loading && <p>Loading...</p>}
        {data.error && <p>Error: {data.error.message}</p>}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead class="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell class="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell class="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
