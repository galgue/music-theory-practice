import { component$, useSignal } from "@builder.io/qwik";

export const Answer = component$<{
  answer: string;
  onClick$: (transitionEndPromise: Promise<void>) => void;
  isRight: boolean;
}>(({ answer, onClick$, isRight = false }) => {
  const isClicked = useSignal(false);

  return (
    <button
      class={`bg-blue-500 text-white font-bold p-4 rounded-md hover:bg-blue-700 capitalize transition-colors duration-200 lg:text-4xl text-8xl ${
        isClicked.value
          ? isRight
            ? "disabled:bg-green-500"
            : "disabled:bg-red-500"
          : ""
      }`}
      onClick$={() => {
        isClicked.value = true;

        const transitionEndPromise = new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 400);
        });

        onClick$(transitionEndPromise);
      }}
      disabled={isClicked.value}
    >
      {answer}
    </button>
  );
});
