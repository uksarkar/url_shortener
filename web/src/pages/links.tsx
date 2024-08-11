import PageTitle from "~/components/base/page-title";
import { Search } from "~/components/base/search";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Flex } from "~/components/ui/flex";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table";
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationItems,
  PaginationNext,
  PaginationPrevious
} from "~/components/ui/pagination";
import { createResource, createSignal, For, Show } from "solid-js";
import { getLinks } from "~/api/link";
import { format } from "date-fns";
import TableLoader from "~/components/base/table-loader";
import CreateLinkDialog from "~/components/forms/CreateLink";

export default function Links() {
  const [perPage, setPerPage] = createSignal(10);
  const [page, setPage] = createSignal(1);

  const [data, { refetch }] = createResource(
    () => [perPage(), page()] as [number, number],
    async ([perPage, page]) => {
      return await getLinks(perPage, page, {
        direction: "desc",
        column: "created_at"
      });
    }
  );

  return (
    <>
      <PageTitle title="Links" />
      <Card>
        <CardHeader>
          <Flex justifyContent="between">
            <Search />
            <div>
              <CreateLinkDialog onSuccess={refetch} />
            </div>
          </Flex>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[100px]">ID</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <Show when={data.loading}>
                <TableLoader cols={5} />
              </Show>
              <Show when={!data.loading}>
                <For each={data()?.data}>
                  {item => (
                    <TableRow>
                      <TableCell class="font-medium">{item.id}</TableCell>
                      <TableCell>
                        {item.original_link}
                        <br />
                        <small class="text-gray-500">
                          {location.origin}/{item.hash}
                        </small>
                      </TableCell>
                      <TableCell>
                        {item.is_active ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell>
                        {format(item.created_at, "MM-dd-yyyy hh:mm")}
                      </TableCell>
                      <TableCell class="text-right">...</TableCell>
                    </TableRow>
                  )}
                </For>
              </Show>
            </TableBody>
          </Table>
          <Flex justifyContent="end">
            <Pagination
              itemComponent={props => (
                <PaginationItem page={props.page}>{props.page}</PaginationItem>
              )}
              ellipsisComponent={() => <PaginationEllipsis />}
              count={data()?.meta.pages || 1}
              onPageChange={page => setPage(page)}
              page={page()}
            >
              <PaginationPrevious />
              <PaginationItems />
              <PaginationNext />
            </Pagination>
          </Flex>
        </CardContent>
      </Card>
    </>
  );
}
