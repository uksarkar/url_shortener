import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { IconTrash } from "../icons";
import { Flex } from "../ui/flex";
import { useMutation } from "~/hooks/useMutation";
import { deleteLink } from "~/api/link";
import { showToast } from "../ui/toast";
import { createSignal } from "solid-js";
import { linksCount, setLinksCount } from "~/stores/link-count";

export function DeleteLink({
  id,
  onSuccess
}: {
  id: number;
  onSuccess: () => void;
}) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [mutate, isLoading, err] = useMutation((idParam: number) =>
    deleteLink(idParam)
  );

  function doDelete() {
    mutate(id).then(message => {
      if (err()) {
        showToast({
          title: "Error",
          description: err(),
          variant: "error"
        });
        return;
      }

      showToast({
        title: "Deleted",
        description: message,
        variant: "default"
      });
      setIsOpen(false);
      onSuccess();
      setLinksCount((linksCount() || 0) - 1);
    });
  }

  return (
    <AlertDialog
      open={isOpen()}
      onOpenChange={opened => !isLoading() && setIsOpen(opened)}
    >
      <AlertDialogTrigger as={Button} variant="destructive">
        <IconTrash />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Attention!</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure?
          <Flex justifyContent="end" class="mt-2">
            <Button
              variant={"destructive"}
              disabled={isLoading()}
              onClick={doDelete}
            >
              Delete
            </Button>
          </Flex>
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
}
