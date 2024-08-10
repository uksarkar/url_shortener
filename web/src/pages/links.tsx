import PageTitle from "~/components/base/page-title";
import { Search } from "~/components/base/search";
import { Button, buttonVariants } from "~/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { showToast } from "~/components/ui/toast";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel
} from "~/components/ui/text-field";
import { createResource, createSignal, For } from "solid-js";
import { getLinks } from "~/api/link";
import { format } from "date-fns";

export default function Links() {
  const [perPage, setPerPage] = createSignal(10);
  const [page, setPage] = createSignal(1);

  const [data] = createResource(
    () => [perPage(), page()] as [number, number],
    async ([perPage, page]) => {
      return await getLinks(perPage, page);
    }
  );

  return (
    <>
      <PageTitle title="Links" />
      <Card>
        <CardHeader>
          <Flex justifyContent="between">
            <Search />
            {data.loading && "Loading..."}
            {data.error && "Something went wrong"}
            <div>
              <Button>Add Link</Button>
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
              <For each={data()?.data}>
                {item => (
                  <TableRow>
                    <TableCell class="font-medium">{item.id}</TableCell>
                    <TableCell>
                      {item.original_link}
                      <br />
                      <small class="text-gray-500"> 
                        {location.origin}/${item.hash}
                      </small>
                    </TableCell>
                    <TableCell>
                      {item.is_active ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell>
                      {format(item.created_at, "MM-dd-yyyy hh:mm")}
                    </TableCell>
                    <TableCell class="text-right">
                      <Dialog>
                        <DialogTrigger
                          class={buttonVariants({ variant: "secondary" })}
                          as={Button<"button">}
                        >
                          Edit
                        </DialogTrigger>
                        <DialogContent class="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit link</DialogTitle>
                            <DialogDescription>
                              Make changes to your profile here. Click save when
                              you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <div class="grid gap-4 py-4">
                            <TextField class="grid grid-cols-4 items-center gap-4">
                              <TextFieldLabel class="text-right">
                                Name
                              </TextFieldLabel>
                              <TextFieldInput
                                value="Pedro Duarte"
                                class="col-span-3"
                                type="text"
                              />
                            </TextField>
                            <TextField class="grid grid-cols-4 items-center gap-4">
                              <TextFieldLabel class="text-right">
                                Username
                              </TextFieldLabel>
                              <TextFieldInput
                                value="@peduarte"
                                class="col-span-3"
                                type="text"
                              />
                            </TextField>
                          </div>
                          <DialogFooter>
                            <Button
                              type="button"
                              onClick={() =>
                                showToast({
                                  title: "Event added.",
                                  description:
                                    "Friday, February 10, 2023 at 5:57 PM",
                                  variant: "success"
                                })
                              }
                            >
                              Save changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )}
              </For>
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
