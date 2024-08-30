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
import { useMutation } from "~/hooks/useMutation";
import Loader from "../base/loader";
import CreateUser from "~/interfaces/CreateUser";
import User from "~/interfaces/User";
import { updateUser } from "~/api/user";
import { produce } from "immer";
import { Checkbox } from "../ui/checkbox";

function defaultFormData(user: User): CreateUser {
  return {
    email: user.email,
    is_active: user.is_active,
    name: user.name,
    is_admin: user.is_admin
  };
}

export default function UpdateUserDialog({
  onSuccess,
  link
}: {
  onSuccess?: (res: Omit<User, "created_at">) => void;
  link: User;
}) {
  const [formData, setFormData] = createSignal<CreateUser>(
    defaultFormData(link)
  );

  const [update, isLoading, err] = useMutation<
    Omit<User, "created_at">,
    { id: number; input: CreateUser }
  >(({ id, input }) => updateUser(id, input));

  const [isOpen, setIsOpen] = createSignal(false);

  function updateByKey<K extends keyof CreateUser>(k: K, value: CreateUser[K]) {
    setFormData(state =>
      produce(state, draft => {
        draft[k] = value;
      })
    );
  }

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
          description: "The user updated",
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
              <TextFieldLabel class="text-right">Name</TextFieldLabel>
              <TextFieldInput
                class="col-span-3"
                type="text"
                placeholder="Name"
                value={formData().name}
                onInput={(event: Event) => {
                  const input = event.target as HTMLInputElement;
                  updateByKey("name", input.value);
                }}
              />
            </TextField>
            <TextField class="grid grid-cols-4 items-center gap-4">
              <TextFieldLabel class="text-right">Email</TextFieldLabel>
              <TextFieldInput
                class="col-span-3"
                type="email"
                placeholder="example@mail.com"
                value={formData().email}
                onInput={(event: Event) => {
                  const input = event.target as HTMLInputElement;
                  updateByKey("email", input.value);
                }}
              />
            </TextField>
            <TextField class="grid grid-cols-4 items-center gap-4">
              <TextFieldLabel class="text-right">Is Active</TextFieldLabel>
              <Checkbox
                checked={formData().is_active}
                onChange={(checked: boolean) => {
                  updateByKey("is_active", checked);
                }}
              />
            </TextField>
            <TextField class="grid grid-cols-4 items-center gap-4">
              <TextFieldLabel class="text-right">Is Admin</TextFieldLabel>
              <Checkbox
                checked={formData().is_admin}
                onChange={(checked: boolean) => {
                  updateByKey("is_admin", checked);
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
