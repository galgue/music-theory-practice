import {
  $,
  useSignal,
  useVisibleTask$,
  type QRL,
  type Signal,
} from "@builder.io/qwik";

export function useLocalStorage<T>(
  key: string,
  initialState: T
): [Signal<T>, QRL<(value: any) => void>] {
  const signal = useSignal(initialState);

  useVisibleTask$(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialState
      signal.value = item ? JSON.parse(item) : initialState;
    } catch (error) {
      // If error also return initialState
      console.log(error);
      signal.value = initialState;
    }
  });

  const setLocalStorageValue$ = $((value: T) => {
    try {
      // Save state
      signal.value = value;
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  });

  return [signal, setLocalStorageValue$];
}
