import { createSignal, Show } from "solid-js";
import { Button } from "../ui/button";
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
import { shortLink } from "~/api/link";
import Link from "~/interfaces/Link";
import Loader from "../base/loader";
import { linksCount, setLinksCount } from "~/stores/link-count";

function defaultFormData(): CreateLink {
  return {
    original_link: "",
    is_active: true
  };
}

export default function CreateLinkDialog({
  onSuccess
}: {
  onSuccess?: () => void;
}) {
  const [formData, setFormData] = createSignal<CreateLink>(defaultFormData());
  const [create, isLoading, err] = useMutation<Link, CreateLink>(shortLink);
  const [isOpen, setIsOpen] = createSignal(false);

  function createLink() {
    create(formData()).then(() => {
      if (err()) {
        showToast({
          title: "Error",
          description: err(),
          variant: "error"
        });
      } else {
        setFormData(defaultFormData());
        setIsOpen(false);

        showToast({
          title: "Success",
          description: "The link has been shorten",
          variant: "success"
        });
        onSuccess?.();
        setLinksCount((linksCount() || 0) + 1);
      }
    });
  }

  return (
    <>
      <Dialog open={isOpen()} onOpenChange={opened => setIsOpen(opened)}>
        <DialogTrigger as={Button<"button">}>Add Link</DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Shorten link</DialogTitle>
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
            <Button type="button" onClick={createLink}>
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
