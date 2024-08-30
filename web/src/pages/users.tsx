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
import { createResource, For, Show } from "solid-js";
import { format } from "date-fns";
import TableLoader from "~/components/base/table-loader";
import { produce } from "immer";
import { IconChevronDown, IconChevronUp } from "~/components/icons";
import { Direction } from "~/interfaces/SortBy";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select";
import useFilter from "~/hooks/useFilter";
import User from "~/interfaces/User";
import { getUsers } from "~/api/user";
import CreateUserDialog from "~/components/forms/create-user";
import { DeleteUser } from "~/components/forms/delete-user";
import UpdateUserDialog from "~/components/forms/update-user";

export default function Users() {
  const {
    perPage,
    page,
    q,
    column,
    direction,
    setQ,
    setPage,
    setPerPage,
    toggleSorting,
    isAsc
  } = useFilter<User>({
    defaultColumn: "created_at",
    defaultDirection: "DESC"
  });

  const [data, { mutate, refetch }] = createResource(
    () =>
      [perPage(), page(), q(), column(), direction()] as [
        number,
        number,
        string,
        keyof User,
        Direction
      ],
    async ([perPage, page, q, column, direction]) => {
      return await getUsers(
        perPage,
        page,
        {
          direction,
          column
        },
        q
      );
    }
  );

  function updateList(user: User) {
    mutate(d =>
      produce(d, draft => {
        if (!draft) {
          return;
        }

        draft.data = draft.data.map(item =>
          user.id === item.id ? { ...item, ...user } : item
        );
      })
    );
  }

  return (
    <>
      <PageTitle title="Users" />
      <Card>
        <CardHeader>
          <Flex justifyContent="between">
            <Search
              value={q()}
              placeholder="Search users..."
              onChange={val => {
                setQ(val);
                console.log(val);
              }}
            />
            <div>
              <CreateUserDialog />
            </div>
          </Flex>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[100px]">ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Is Active</TableHead>
                <TableHead
                  class="bg-gray-100 cursor-pointer"
                  onClick={toggleSorting}
                >
                  <Flex justifyContent="between">
                    Added
                    <div>
                      <IconChevronUp color={!isAsc() ? "#ccc" : undefined} />
                      <IconChevronDown color={isAsc() ? "#ccc" : undefined} />
                    </div>
                  </Flex>
                </TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <Show when={data.loading}>
                <TableLoader cols={5} />
              </Show>
              <Show when={!data.loading && !data()?.data.length}>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Flex justifyContent="center" class="h-10">
                      <span class="text-gray-400">Empty</span>
                    </Flex>
                  </TableCell>
                </TableRow>
              </Show>
              <Show when={!data.loading}>
                <For each={data()?.data}>
                  {item => (
                    <TableRow>
                      <TableCell class="font-medium">{item.id}</TableCell>
                      <TableCell>
                        {item.email}
                        <br />
                        <small class="text-gray-500">
                          {item.is_admin ? "ADMIN" : "USER"}
                        </small>
                      </TableCell>
                      <TableCell>
                        {item.name}
                      </TableCell>
                      <TableCell>
                        {item.is_active ? "ACTIVE" : "DISABLED"}
                      </TableCell>
                      <TableCell>
                        {format(item.created_at, "MM-dd-yyyy hh:mm")}
                      </TableCell>
                      <TableCell class="text-right">
                        <Flex justifyContent="end" class="gap-2">
                          <UpdateUserDialog
                            link={item}
                            onSuccess={res => updateList({ ...item, ...res })}
                          />
                          <DeleteUser
                            id={item.id}
                            onSuccess={() => refetch()}
                          />
                        </Flex>
                      </TableCell>
                    </TableRow>
                  )}
                </For>
              </Show>
            </TableBody>
          </Table>
          <Flex justifyContent="between">
            <div class="flex gap-2 items-center">
              Per page:
              <Select
                value={perPage()}
                onChange={setPerPage}
                options={[10, 20, 50, 100]}
                itemComponent={props => (
                  <SelectItem item={props.item}>
                    {props.item.rawValue}
                  </SelectItem>
                )}
              >
                <SelectTrigger aria-label="Per page" class="w-[180px]">
                  <SelectValue<string>>
                    {state => state.selectedOption()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent />
              </Select>
            </div>
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
