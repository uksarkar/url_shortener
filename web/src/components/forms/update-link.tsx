import { createSignal, Show } from "solid-js";
import { Button, buttonVariants } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import { TextField, TextFieldInput, TextFieldLabel } from "../ui/text-field";
import { showToast } from "../ui/toast";
import type CreateLink from "~/interfaces/CreateLink";
import { useMutation } from "~/hooks/useMutation";
import { updateLink } from "~/api/link";
import Link from "~/interfaces/Link";
import Loader from "../base/loader";

function defaultFormData(link: Link): CreateLink {
  return {
    original_link: link.original_link,
    is_active: link.is_active,
    domain_id: link.domain_id,
    hash: link.hash
  };
}

export default function UpdateLinkDialog({
  onSuccess,
  link
}: {
  onSuccess?: (res: Omit<Link, "created_at">) => void;
  link: Link;
}) {
  const [formData, setFormData] = createSignal<CreateLink>(
    defaultFormData(link)
  );

  const [update, isLoading, err] = useMutation<
    Omit<Link, "created_at">,
    { id: number; input: CreateLink }
  >(({ id, input }) => updateLink(id, input));

  const [isOpen, setIsOpen] = createSignal(false);

  function doUpdate() {
    update({ id: link.id, input: formData() }).then(res => {
      if (err()) {
        showToast({
          title: "Error",
          description: err(),
          variant: "error"
        });
      } else {
        setFormData(defaultFormData({ ...link, ...res }));
        setIsOpen(false);

        showToast({
          title: "Success",
          description: "The link has been updated",
          variant: "success"
        });

        onSuccess?.(res!);
      }
    });
  }

  return (
    <>
      <Dialog open={isOpen()} onOpenChange={opened => setIsOpen(opened)}>
        <DialogTrigger
          class={buttonVariants({ variant: "secondary" })}
          as={Button<"button">}
        >
          Edit
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update link</DialogTitle>
            <DialogDescription>
              Fill the form and click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <TextField class="grid grid-cols-4 items-center gap-4">
              <TextFieldLabel class="text-right">Link</TextFieldLabel>
              <TextFieldInput
                class="col-span-3"
                type="text"
                value={formData().original_link}
                onInput={(event: Event) => {
                  const input = event.target as HTMLInputElement;
                  setFormData(state => ({
                    ...state,
                    original_link: input.value
                  }));
                }}
              />
            </TextField>
            <TextField class="grid grid-cols-4 items-center gap-4">
              <TextFieldLabel class="text-right">Hash</TextFieldLabel>
              <TextFieldInput
                class="col-span-3"
                type="text"
                placeholder="shorten hash"
                value={formData().hash}
                onInput={(event: Event) => {
                  const input = event.target as HTMLInputElement;
                  setFormData(state => ({
                    ...state,
                    hash: input.value
                  }));
                }}
              />
            </TextField>
          </div>
          <DialogFooter>
            <Button type="button" onClick={doUpdate}>
              <Show when={isLoading()} fallback={"Save"}>
                <Loader />
              </Show>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
