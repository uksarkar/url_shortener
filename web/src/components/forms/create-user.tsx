import { createSignal, Show } from "solid-js";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import { TextField, TextFieldInput, TextFieldLabel } from "../ui/text-field";
import { showToast } from "../ui/toast";
import type CreateUser from "~/interfaces/CreateUser";
import { useMutation } from "~/hooks/useMutation";
import User from "~/interfaces/User";
import Loader from "../base/loader";
import { createUser } from "~/api/user";
import { Checkbox } from "../ui/checkbox";
import { produce } from "immer";

function defaultFormData(): CreateUser {
  return {
    is_active: true,
    email: "",
    name: "",
    is_admin: false
  };
}

export default function CreateUserDialog({
  onSuccess
}: {
  onSuccess?: () => void;
}) {
  const [formData, setFormData] = createSignal<CreateUser>(defaultFormData());
  const [create, isLoading, err] = useMutation<User, CreateUser>(createUser);
  const [isOpen, setIsOpen] = createSignal(false);

  function submitForm() {
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
          description: "User created",
          variant: "success"
        });
        onSuccess?.();
      }
    });
  }

  function updateByKey<K extends keyof CreateUser>(k: K, value: CreateUser[K]) {
    setFormData(state =>
      produce(state, draft => {
        draft[k] = value;
      })
    );
  }

  return (
    <>
      <Dialog open={isOpen()} onOpenChange={opened => setIsOpen(opened)}>
        <DialogTrigger as={Button<"button">}>Add User</DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
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
            <Button type="button" onClick={submitForm}>
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
