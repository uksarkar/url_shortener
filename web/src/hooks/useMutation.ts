import { ClientError } from "graphql-request";
import { createSignal } from "solid-js";

export function useMutation<T, D>(
  cb: (data: D) => Promise<T>
): [(data: D) => Promise<T | undefined>, () => boolean, () => string | null] {
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  async function mutate(data: D): Promise<T | undefined> {
    setIsLoading(true);
    setError(null);
    try {
      return await cb(data);
    } catch (err) {
      const message = (err as ClientError).response?.errors?.[0]?.message;
      setError(message || (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return [mutate, isLoading, error];
}
