import { useEffect, useState } from "react";
import { Timer } from "./Timer";
import { ChoosePlan } from "./ChoosePlan";
import type { PlanType } from "../../types";
import type { ExerciseType } from "../../types";
import { useUserContext } from "../useUserContext";
import { createWorkoutData, updateWorkoutData } from "../../supabase-client";
type WeekdayKeys =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface currentWorkoutType {
  date: number;
  data: ExerciseType[] | [];
  exercise: ExerciseType[] | [];
  nextExercise: number;
  nextSet: number;
}

const saveCurrentWorkout = (workoutDate: Date, planName: string) => {
  if (localStorage.getItem("currentWorkout")) return;
  const currentWorkout: currentWorkoutType = {
    date: workoutDate.getTime(),
    data: [{ exerciseName: "", weightRep: [] }],
    exercise: [],
    nextExercise: 0,
    nextSet: 0,
  };
  createWorkoutData(planName);
  localStorage.setItem("currentWorkout", JSON.stringify(currentWorkout));
};

const updateSaveCurrentWorkout = (
  nextSet: number,
  nextExercise: number,
  weightRep: [number, number],
  exerciseName: string,
  exercise: ExerciseType[]
) => {
  const getSavedCurrentWorkout = localStorage.getItem("currentWorkout");
  const currentWorkout: currentWorkoutType =
    getSavedCurrentWorkout && JSON.parse(getSavedCurrentWorkout);
  currentWorkout.nextSet = nextSet;
  if (currentWorkout.nextExercise != nextExercise) {
    currentWorkout.nextExercise = nextExercise;
    currentWorkout.data = [
      ...currentWorkout.data,
      { exerciseName: exerciseName, weightRep: [weightRep] },
    ];
  } else {
    currentWorkout.data[nextExercise].weightRep.push(weightRep);
  }
  currentWorkout.exercise = exercise;
  localStorage.setItem("currentWorkout", JSON.stringify(currentWorkout));
};

const deleteSaveCurrentWorkout = () => {
  localStorage.removeItem("currentWorkout");
};

export function Workout() {
  const { userData, setUserData, currentPlanIdx } = useUserContext();
  const [startTimer, setStartTimer] = useState(false);
  const [isWorkOutDone, setIsWorkOutDone] = useState(userData.workoutStatus);
  const [currentPlan, setCurrentPlan] = useState<PlanType>(
    userData.planList
      ? JSON.parse(JSON.stringify(userData.planList[currentPlanIdx]))
      : []
  );
  const now = new Date();
  const currentDay = daysOfWeek[now.getDay()] as WeekdayKeys;
  const [exercises, setExercises] = useState(currentPlan[currentDay]);
  const [nextExercise, setNextExercise] = useState(0);
  const [nextSet, setNextSet] = useState(0);

  const showNextExerciseSet = (exerciseIdx: number, setIdx: number) => {
    if (
      exercises[exerciseIdx].weightRep.length - 1 <= setIdx &&
      exercises.length - 1 <= exerciseIdx
    ) {
      return "Finish";
    }

    if (exercises[exerciseIdx].weightRep.length - 1 <= setIdx) {
      return `Next - ${exercises[exerciseIdx + 1].exerciseName} | Rep: ${
        exercises[exerciseIdx + 1].weightRep[0][0]
      } | Weight: ${exercises[exerciseIdx + 1].weightRep[0][1]}`;
    }

    return `Next - ${exercises[exerciseIdx].exerciseName} | Rep: ${
      exercises[exerciseIdx].weightRep[setIdx + 1][0]
    } | Weight: ${exercises[exerciseIdx].weightRep[setIdx + 1][1]}`;
  };

  const showExerciseSet = (exerciseIdx: number, setIdx: number) => {
    return `Now - ${exercises[exerciseIdx].exerciseName} | Rep: ${exercises[exerciseIdx].weightRep[setIdx][0]} | Weight: ${exercises[exerciseIdx].weightRep[setIdx][1]}`;
  };

  const setNextSetHandler = () => {
    if (
      exercises.length - 1 == nextExercise &&
      exercises[nextExercise].weightRep.length - 1 == nextSet
    ) {
      setIsWorkOutDone(true);
      return;
    } else if (exercises[nextExercise].weightRep.length - 1 == nextSet) {
      setNextExercise((prev) => prev + 1);
      setNextSet(0);
    } else {
      setNextSet((prev) => prev + 1);
    }
    console.log(exercises);
  };

  const addSetHandler = () => {
    setExercises((prev) => {
      const newExercises = [...prev];
      const newWeightRep = [...newExercises[nextExercise].weightRep];
      const copiedSet = JSON.parse(JSON.stringify(newWeightRep[nextSet]));
      newWeightRep.splice(nextSet + 1, 0, copiedSet);
      newExercises[nextExercise].weightRep = newWeightRep;
      return newExercises;
    });
  };

  const changeCurrentRepHandler = (direction: string) => {
    if (direction === "UP") {
      setExercises((prev) => {
        const newExercises = [...prev];
        newExercises[nextExercise].weightRep[nextSet][0] += 1;
        return newExercises;
      });
      return;
    }
    if (direction === "DOWN") {
      if (exercises[nextExercise].weightRep[nextSet][0] === 0) return;
      setExercises((prev) => {
        const newExercises = [...prev];
        newExercises[nextExercise].weightRep[nextSet][0] -= 1;
        return newExercises;
      });
      return;
    }
  };

  const changeCurrentWeightHandler = (direction: string) => {
    if (direction === "UP") {
      setExercises((prev) => {
        const newExercises = [...prev];
        newExercises[nextExercise].weightRep[nextSet][1] += 1;
        return newExercises;
      });
      return;
    }
    if (direction === "DOWN") {
      if (exercises[nextExercise].weightRep[nextSet][1] === 0) return;
      setExercises((prev) => {
        const newExercises = [...prev];
        newExercises[nextExercise].weightRep[nextSet][1] -= 1;
        return newExercises;
      });
      return;
    }
  };

  useEffect(() => {
    if (isWorkOutDone) {
      const currentWorkoutJSON = localStorage.getItem("currentWorkout");
      const workoutData = currentWorkoutJSON
        ? JSON.parse(currentWorkoutJSON).data
        : undefined;
      updateWorkoutData(new Date().getTime(), workoutData, true);
      deleteSaveCurrentWorkout();
      setStartTimer(false);
      setUserData((prev) => ({ ...prev, workoutStatus: true }));
      sessionStorage.setItem("gymTimerValue", JSON.stringify([0, 0]));
    }
  }, [isWorkOutDone, setUserData]);

  useEffect(() => {
    const currentWorkoutJSON = localStorage.getItem("currentWorkout");

    if (currentWorkoutJSON) {
      const currentWorkout = JSON.parse(currentWorkoutJSON);
      setExercises(currentWorkout.exercise);
      setNextExercise(currentWorkout.nextExercise);
      setNextSet(currentWorkout.nextSet);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("currentWorkout")) return;
    updateSaveCurrentWorkout(
      nextSet,
      nextExercise,
      exercises[nextExercise].weightRep[nextSet],
      exercises[nextExercise].exerciseName,
      exercises
    );
  }, [nextExercise, nextSet, exercises]);

  return (
    <div className="flex flex-col grow text-text-main">
      {!userData.planList ? (
        <div className="flex grow items-center justify-center text-2xl text-text-main">
          To start workout, first create a workout plan.
        </div>
      ) : exercises.length > 0 ? (
        <>
          <div className="text-text-main text-2xl text-center">
            <h2>Current plan: {currentPlan.planName}</h2>
            <h1>
              {!isWorkOutDone
                ? showExerciseSet(nextExercise, nextSet)
                : "Workout is done!"}
            </h1>
            <h1 className="text-text-secondary">
              {!isWorkOutDone && showNextExerciseSet(nextExercise, nextSet)}
            </h1>
            {!isWorkOutDone && (
              <div>
                {" "}
                <button
                  onClick={addSetHandler}
                  className="border-2 border-border px-4 py-2 rounded-xl cursor-pointer hover:border-button-hover"
                >
                  Add Set
                </button>
                <div className="flex justify-around">
                  Change current rep number:
                  <button
                    onClick={() => changeCurrentRepHandler("UP")}
                    className="border-2 border-border px-4 py-2 rounded-xl cursor-pointer hover:border-button-hover"
                  >
                    Up
                  </button>
                  <button
                    onClick={() => changeCurrentRepHandler("DOWN")}
                    className="border-2 border-border px-4 py-2 rounded-xl cursor-pointer hover:border-button-hover"
                  >
                    Down
                  </button>
                </div>
                <div className="flex justify-around">
                  Change current weight number:
                  <button
                    onClick={() => changeCurrentWeightHandler("UP")}
                    className="border-2 border-border px-4 py-2 rounded-xl cursor-pointer hover:border-button-hover"
                  >
                    Up
                  </button>
                  <button
                    onClick={() => changeCurrentWeightHandler("DOWN")}
                    className="border-2 border-border px-4 py-2 rounded-xl cursor-pointer hover:border-button-hover"
                  >
                    Down
                  </button>
                </div>
              </div>
            )}
          </div>
          {!isWorkOutDone && (
            <Timer isWorkOutDone={isWorkOutDone} startTimer={startTimer} />
          )}
          {!isWorkOutDone && (
            <div>
              <button
                onClick={() => {
                  saveCurrentWorkout(now, currentPlan.planName);
                  setStartTimer((prev) => !prev);
                }}
                className="text-2xl cursor-pointer w-25 h-14 px-4 py-2 border-2 border-border bg-bg-secondary hover:bg-button-hover rounded-xl"
              >
                {startTimer ? "Stop" : "Start"}
              </button>
              {startTimer && (
                <button
                  onClick={() => {
                    setNextSetHandler();
                  }}
                  className="text-2xl cursor-pointer w-25 h-14 px-4 py-2 border-2 border-border bg-bg-secondary hover:bg-button-hover rounded-xl"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <ChoosePlan setCurrentPlan={setCurrentPlan} />
      )}
    </div>
  );
}
