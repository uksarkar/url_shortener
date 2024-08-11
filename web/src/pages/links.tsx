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
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Show
} from "solid-js";
import { getLinks, updateLink } from "~/api/link";
import { format } from "date-fns";
import TableLoader from "~/components/base/table-loader";
import CreateLinkDialog from "~/components/forms/create-link";
import { Checkbox } from "~/components/ui/checkbox";
import Link from "~/interfaces/Link";
import { showToast } from "~/components/ui/toast";
import { produce } from "immer";
import { useSearchParams } from "@solidjs/router";
import { useMutation } from "~/hooks/useMutation";
import UpdateLinkDialog from "~/components/forms/update-link";

export default function Links() {
  const [search, setSearch] = useSearchParams();
  const [perPage] = createSignal(10);
  const [page, setPage] = createSignal(Number(search.page) || 1);

  const [data, { refetch, mutate }] = createResource(
    () => [perPage(), page()] as [number, number],
    async ([perPage, page]) => {
      return await getLinks(perPage, page, {
        direction: "desc",
        column: "created_at"
      });
    }
  );

  const [linkUpdate, isUpdating, updateErr] = useMutation((updatedLink: Link) =>
    updateLink(updatedLink.id, {
      original_link: updatedLink.original_link,
      domain_id: updatedLink.domain_id,
      hash: updatedLink.hash,
      is_active: updatedLink.is_active
    })
  );

  function updateList(link: Link) {
    mutate(d =>
      produce(d, draft => {
        if (!draft) {
          return;
        }

        draft.data = draft.data.map(item =>
          link.id === item.id ? { ...item, ...link } : item
        );
      })
    );
  }

  function update(link: Link) {
    linkUpdate(link).then(res => {
      if (!updateErr()) {
        showToast({
          variant: "success",
          title: "Success",
          description: `Link updated`
        });
        updateList({ ...link, ...res });
      } else {
        showToast({
          variant: "error",
          title: "Err",
          description: updateErr()
        });
      }
    });
  }

  createEffect(() => {
    setSearch({
      page: page()
    });
  });

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
                        <Checkbox
                          checked={item.is_active}
                          onChange={(checked: boolean) => {
                            update({ ...item, is_active: checked });
                          }}
                          disabled={isUpdating()}
                        />
                      </TableCell>
                      <TableCell>
                        {format(item.created_at, "MM-dd-yyyy hh:mm")}
                      </TableCell>
                      <TableCell class="text-right">
                        <UpdateLinkDialog
                          link={item}
                          onSuccess={res => updateList({ ...item, ...res })}
                        />
                      </TableCell>
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
