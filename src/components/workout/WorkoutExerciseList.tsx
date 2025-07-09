import type { ExerciseType } from "../../types";
import { useEffect, useState } from "react";
interface PropsType {
  showWorkoutListHandler: () => void;
  showWorkoutList: boolean;
  currentWorkout: ExerciseType[];
  setCurrentWorkout: React.Dispatch<React.SetStateAction<ExerciseType[]>>;
  exerciseNote: {
    currentIdx: number;
    currentSetIdx: number;
  };
}
interface editSetType {
  exerciseIdx: number;
  setIdx: number;
}
export function WorkoutExerciseList({
  showWorkoutListHandler,
  showWorkoutList,
  currentWorkout,
  setCurrentWorkout,
  exerciseNote,
}: PropsType) {
  const [selectedSet, setSelectedSet] = useState<editSetType | undefined>(
    undefined,
  );
  const selectSetHandler = (setIdx: number, exerciseIdx: number) => {
    setSelectedSet({ exerciseIdx: exerciseIdx, setIdx: setIdx });
  };
  const changeRepWeight = (
    setIdx: number,
    exerciseIdx: number,
    weightRep: number,
    value: number,
  ) => {
    setCurrentWorkout((prev) => {
      const newWorkout = [...prev];
      const newRepWeight = newWorkout[exerciseIdx].weightRep[setIdx];
      newRepWeight[weightRep] = value;
      newWorkout[exerciseIdx].weightRep[setIdx] = newRepWeight;
      return newWorkout;
    });
  };

  const deleteSetHandler = (setIdx: number, exerciseIdx: number) => {
    setCurrentWorkout((prev) => {
      if (currentWorkout[exerciseIdx].weightRep.length === 1) return [...prev];
      const newWorkout = [...prev];
      const newExerciseSets = newWorkout[exerciseIdx].weightRep.filter(
        (elem, idx) => {
          if (setIdx != idx) return elem;
        },
      );
      newWorkout[exerciseIdx].weightRep = newExerciseSets;

      return newWorkout;
    });
  };
  const copySetHandler = (setIdx: number, exerciseIdx: number) => {
    setCurrentWorkout((prev) => {
      const newWorkout = [...prev];
      newWorkout[exerciseIdx].weightRep.splice(setIdx, 0, [
        ...newWorkout[exerciseIdx].weightRep[setIdx],
      ]);
      return newWorkout;
    });
  };
  useEffect(() => {
    setSelectedSet(undefined);
  }, [exerciseNote]);

  return (
    <div
      className={`${showWorkoutList ? "absolute top-0 right-0 w-full md:w-2/3" : "absolute top-0 right-0 w-0"} bg-bg md:border-border text-text-main z-9 flex h-full flex-col overflow-x-hidden overflow-y-auto text-2xl transition-[width] duration-300 md:relative md:border-l-2`}
    >
      <div className="border-border bg-bg-secondary mt-10 mb-4 flex min-w-9/10 grow flex-col items-center overflow-x-hidden overflow-y-auto border-y-2">
        {currentWorkout?.map((exercise, idxExe) => (
          <div
            key={exercise.exerciseName + idxExe}
            className={`flex w-full flex-col items-center ${exerciseNote.currentIdx > idxExe && "text-text-secondary pointer-events-none"} ${currentWorkout.length != idxExe && "border-border border-b-2"}`}
          >
            <span>{exercise.exerciseName}</span>
            <div className="flex w-full justify-center">
              <span className="border-border w-1/3 border-t-2 text-center">
                №
              </span>
              <span className="border-border w-1/3 border-t-2 border-l-2 text-center">
                Rep
              </span>
              <span className="border-border w-1/3 border-t-2 border-l-2 text-center">
                Weight
              </span>
            </div>
            {exercise.weightRep.map((_, idx) => (
              <div
                key={idxExe + idx}
                onClick={() => {
                  selectSetHandler(idx, idxExe);
                }}
                className={`${selectedSet?.exerciseIdx === idxExe && selectedSet.setIdx === idx && "bg-button"} ${exerciseNote.currentIdx === idxExe && exerciseNote.currentSetIdx > idx && "text-text-secondary pointer-events-none"} flex w-full justify-center`}
              >
                <span
                  className={`border-border hover:bg-button-hover active:bg-button-hover w-1/3 cursor-pointer border-t-2 text-center`}
                >
                  {idx + 1}
                </span>

                <input
                  onChange={(e) => {
                    changeRepWeight(idx, idxExe, 0, Number(e.target.value));
                  }}
                  type="number"
                  value={currentWorkout[idxExe].weightRep[idx][0]}
                  className={`border-border hover:bg-button-hover active:bg-button-hover w-1/3 cursor-pointer border-t-2 border-l-2 text-center outline-0`}
                />

                <input
                  onChange={(e) => {
                    changeRepWeight(idx, idxExe, 1, Number(e.target.value));
                  }}
                  type="number"
                  value={currentWorkout[idxExe].weightRep[idx][1]}
                  className={`border-border hover:bg-button-hover active:bg-button-hover w-1/3 cursor-pointer border-t-2 border-l-2 text-center outline-0`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="w-full grow px-4 py-4">
        <div className="flex w-full justify-center gap-4 overflow-x-hidden">
          <button
            onClick={() => {
              deleteSetHandler(
                selectedSet?.setIdx as number,
                selectedSet?.exerciseIdx as number,
              );
            }}
            className={`border-border bg-bg-secondary ${selectedSet === undefined && "pointer-events-none opacity-50"} active:border-button hover:border-button active:bg-button-hover ease w-1/2 cursor-pointer overflow-hidden rounded-xl border-2 px-4 py-2 transition-colors duration-300 active:scale-96`}
          >
            Delete
          </button>
          <button
            onClick={() =>
              copySetHandler(
                selectedSet?.setIdx as number,
                selectedSet?.exerciseIdx as number,
              )
            }
            className={`border-border bg-bg-secondary ${selectedSet === undefined && "pointer-events-none opacity-50"} active:border-button hover:border-button active:bg-button-hover ease w-1/2 cursor-pointer overflow-hidden rounded-xl border-2 px-4 py-2 transition-colors duration-300 active:scale-96`}
          >
            Copy
          </button>
        </div>
        <div className="flex w-full justify-center gap-4 overflow-x-hidden pt-4 md:hidden">
          <button
            onClick={showWorkoutListHandler}
            className="border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease w-full cursor-pointer overflow-hidden rounded-xl border-2 px-4 py-2 transition-colors duration-300 active:scale-96"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
