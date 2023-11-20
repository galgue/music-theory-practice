import { component$, useSignal } from "@builder.io/qwik";
import { Answer } from "../../components/Answer";
import { MusicSheet, type Note } from "../../components/TabSheet";

const keys = ["c", "d", "e", "f", "g", "a", "b"] as const;

const createRandomNote = (): Note => ({
  key: keys[Math.floor(Math.random() * keys.length)],
  duration: "q",
  octave_shift: Math.floor(Math.random() * 3) - 1,
});

const createRandomAnswer = (rightAnswer: Note): string[] => {
  const rightNote =
    rightAnswer.key instanceof Array ? rightAnswer.key[0] : rightAnswer.key;

  const possibleAnswers = keys
    .filter((key) => rightNote !== key)
    .sort(() => Math.random() - 0.5);

  return [rightNote, ...possibleAnswers.slice(0, 3)].sort(
    () => Math.random() - 0.5
  );
};

export const NotesPractice = component$(() => {
  const notes = useSignal<Array<Note>>(
    new Array(8).fill(0).map(() => createRandomNote())
  );
  const questionNumber = useSignal(0);

  const answers = useSignal<string[]>(createRandomAnswer(notes.value[0]));

  return (
    <div class="flex flex-col">
      <MusicSheet
        notes={notes}
        className="[&_#vf-right-answer_path]:animate-[right-answer_500ms_ease-in-out]  [&_#vf-wrong-answer_path]:animate-[wrong-answer_500ms_ease-in-out]"
      />
      <div class="grid grid-cols-2 grid-row-2 gap-4 aspect-square lg:aspect-auto mr-4 ml-4 flex-1">
        {answers.value.map((answer, index) => {
          return (
            <Answer
              key={`${questionNumber.value}-${index}`}
              isRight={answer === notes.value[0].key}
              answer={answer}
              onClick$={async (transitionEndPromise) => {
                const isRight = answer === notes.value[0].key;
                notes.value = [
                  {
                    ...notes.value[0],
                    id: isRight ? "right-answer" : "wrong-answer",
                  },
                  ...notes.value.slice(1),
                ];
                await transitionEndPromise;
                notes.value = [
                  {
                    ...notes.value[0],
                    id: undefined,
                  },
                  ...notes.value.slice(1),
                ];
                if (answer === notes.value[0].key) {
                  notes.value = [...notes.value.slice(1), createRandomNote()];
                  questionNumber.value += 1;
                  answers.value = createRandomAnswer(notes.value[0]);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
});
