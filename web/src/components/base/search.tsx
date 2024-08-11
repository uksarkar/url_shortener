import { TextField, TextFieldInput } from "~/components/ui/text-field";

export function Search({
  onChange,
  placeholder,
  value
}: {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
}) {
  return (
    <div>
      <TextField>
        <TextFieldInput
          type="search"
          placeholder={placeholder || "Search..."}
          class="md:w-[100px] lg:w-[300px]"
          value={value}
          onChange={(e: Event) =>
            onChange?.((e.target as HTMLInputElement).value)
          }
        />
      </TextField>
    </div>
  );
}
