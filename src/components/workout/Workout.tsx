import { useEffect, useState } from "react";
import { ChooseWorkoutPlan } from "./ChooseWorkoutPlan";
import { Timer } from "./Timer";
import { WorkoutExerciseList } from "./WorkoutExerciseList";
import { useUserContext } from "../useUserContext";
import type { PlanType, ExerciseType } from "../../types";
import {
  createWorkoutData,
  updateWorkoutData,
  deleteWorkoutData,
} from "../../supabase-client";
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

export function Workout() {
  const currentDay = daysOfWeek[new Date().getDay()] as WeekdayKeys;
  const { userData, currentPlanIdx } = useUserContext();
  const [currentPlan, setCurrentPlan] = useState<PlanType>(
    userData.planList
      ? JSON.parse(JSON.stringify(userData.planList[currentPlanIdx]))
      : {},
  );
  const [currentWorkout, setCurrentWorkout] = useState<ExerciseType[]>(
    currentPlan[currentDay],
  );
  const [isWorkoutStart, setIsWorkoutStart] = useState(false);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [pauseWorkout, setPauseWorkout] = useState(false);
  const [showWorkoutList, setShowWorkoutList] = useState(false);
  const [showPlanList, setShowPlanList] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [exerciseNote, setExerciseNote] = useState({
    currentIdx: 0,
    currentSetIdx: 0,
  });
  const startWorkoutHandler = () => {
    if (currentWorkout.length === 0) return;
    const workoutDate = new Date().getTime();
    localStorage.setItem("workoutDate", JSON.stringify(workoutDate));
    createWorkoutData(currentPlan.planName, workoutDate);
    setIsWorkoutStart(true);
  };
  const stopWorkoutHandler = () => {
    setIsWorkoutStart(false);
  };
  const showWorkoutListHandler = () => {
    setShowWorkoutList((prev) => !prev);
  };
  const showPlanListHandler = () => {
    setShowPlanList((prev) => !prev);
  };
  const pauseWorkoutHandler = () => {
    setPauseWorkout((prev) => !prev);
  };

  const checkForFinish = () => {
    const { currentIdx, currentSetIdx } = exerciseNote;
    return (
      currentWorkout.length - 1 === currentIdx &&
      currentWorkout[currentIdx].weightRep.length - 1 === currentSetIdx
    );
  };
  const checkForLastSet = () => {
    const { currentIdx, currentSetIdx } = exerciseNote;
    return currentWorkout[currentIdx].weightRep.length - 1 === currentSetIdx;
  };

  const nextHandler = () => {
    if (pauseWorkout) return;
    if (checkForFinish()) {
      const dateJSON = localStorage.getItem("workoutDate");
      if (dateJSON) {
        const date = JSON.parse(dateJSON);
        updateWorkoutData(date, JSON.stringify(currentWorkout));
      }
      setIsWorkoutComplete(true);
      return;
    }
    setExerciseNote((prev) => {
      const newNote = { ...prev };

      const changeCurrentExerciseIdx = () => {
        let newIdx = newNote.currentIdx;
        if (
          exerciseNumber > newNote.currentIdx &&
          exerciseSetsNumber === newNote.currentSetIdx
        ) {
          newIdx = newNote.currentIdx + 1;
        }
        return newIdx;
      };

      const changeCurrentSetIdx = () => {
        let newIdx = newNote.currentSetIdx + 1;
        if (
          exerciseNumber > newNote.currentIdx &&
          exerciseSetsNumber === newNote.currentSetIdx
        ) {
          newIdx = 0;
        }
        return newIdx;
      };

      const exerciseNumber = currentWorkout?.length - 1;
      const exerciseSetsNumber =
        currentWorkout[newNote.currentIdx].weightRep.length - 1;

      const newCurrentIdx = changeCurrentExerciseIdx();
      const newCurrentSetIdx = changeCurrentSetIdx();

      newNote.currentIdx = newCurrentIdx;
      newNote.currentSetIdx = newCurrentSetIdx;

      return newNote;
    });
  };

  useEffect(() => {
    const backupJson = localStorage.getItem("currentWorkoutBackup");
    if (backupJson) {
      const backup = JSON.parse(backupJson);
      setCurrentWorkout(backup.currentWorkout);
      setIsWorkoutStart(backup.isWorkoutStart);
      setCurrentPlan(backup.currentPlan);
      setIsWorkoutComplete(backup.isWorkoutComplete);
      setExerciseNote(backup.exerciseNote);
      setPauseWorkout(true);
    }
  }, []);

  useEffect(() => {
    if (isWorkoutComplete) {
      localStorage.removeItem("currentTimerBackup");
      localStorage.removeItem("currentWorkoutBackup");
      localStorage.removeItem("workoutDate");
    }
  }, [isWorkoutComplete]);

  return (
    <div className="h-[calc(100%-60px)] w-full">
      {!userData.planList ? (
        <div className="text-text-main flex h-full items-center justify-center text-center text-2xl">
          To start workout create a new plan or add exercises to selected one
          for today.
        </div>
      ) : currentWorkout.length === 0 ? (
        <div className="text-text-main flex h-full items-center justify-center text-center text-2xl">
          There no workout for today or your workout is empty.
        </div>
      ) : isWorkoutComplete ? (
        <div className="text-text-main flex h-full items-center justify-center text-center text-2xl">
          Workout is complete!
        </div>
      ) : (
        <div className="relative flex h-full w-full grow flex-row">
          {showConfirm && (
            <div className="text-text-main bg-err bg-bg-secondary-transparent absolute z-9 flex h-full w-full flex-col items-center justify-center text-2xl">
              <div className="bg-bg border-border flex flex-col gap-6 rounded-xl border-2 px-10 py-10">
                <span className="">Are you shure?</span>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setPauseWorkout(false);
                      setShowConfirm(false);
                      localStorage.removeItem("currentTimerBackup");
                      localStorage.removeItem("currentWorkoutBackup");
                      const dateJSON = localStorage.getItem("workoutDate");
                      if (dateJSON) {
                        const date = JSON.parse(dateJSON);
                        deleteWorkoutData(date);
                      }
                      localStorage.removeItem("workoutDate");
                      stopWorkoutHandler();
                    }}
                    className="border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease cursor-pointer rounded-xl border-2 px-4 py-2 transition-colors duration-300 active:scale-96"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirm(false);
                    }}
                    className="border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease cursor-pointer rounded-xl border-2 px-4 py-2 transition-colors duration-300 active:scale-96"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="relative flex w-full grow flex-col items-center">
            <ChooseWorkoutPlan
              showPlanList={showPlanList}
              showPlanListHandler={showPlanListHandler}
              currentPlan={currentPlan}
              setCurrentPlan={setCurrentPlan}
              currentDay={currentDay}
            />
            <div
              className={`text-text-main flex w-full flex-col items-center justify-center text-2xl ${!isWorkoutStart && "hidden"}`}
            >
              {isWorkoutComplete ? (
                <span>Workout is complete!</span>
              ) : (
                <>
                  <span className="font-bold">
                    {currentWorkout[exerciseNote.currentIdx].exerciseName}
                  </span>
                  <span>
                    {"Set: " +
                      (exerciseNote.currentSetIdx + 1) +
                      " Rep: " +
                      currentWorkout[exerciseNote.currentIdx].weightRep[
                        exerciseNote.currentSetIdx
                      ][0] +
                      " " +
                      "Weight: " +
                      currentWorkout[exerciseNote.currentIdx].weightRep[
                        exerciseNote.currentSetIdx
                      ][1]}
                  </span>
                  {checkForFinish() ? (
                    <span className="text-text-secondary">Finish</span>
                  ) : (
                    <>
                      <span className="text-text-secondary font-bold">
                        {checkForLastSet()
                          ? currentWorkout[exerciseNote.currentIdx + 1]
                              .exerciseName
                          : currentWorkout[exerciseNote.currentIdx]
                              .exerciseName}
                      </span>
                      <span className="text-text-secondary">
                        {"Set: " +
                          (checkForLastSet()
                            ? 1
                            : exerciseNote.currentSetIdx + 1 === 1
                              ? 2
                              : exerciseNote.currentSetIdx + 2) +
                          " Rep: " +
                          "Rep: " +
                          (checkForLastSet()
                            ? currentWorkout[exerciseNote.currentIdx + 1]
                                .weightRep[0][0]
                            : currentWorkout[exerciseNote.currentIdx].weightRep[
                                exerciseNote.currentSetIdx + 1
                              ][0]) +
                          " " +
                          "Weight: " +
                          (checkForLastSet()
                            ? currentWorkout[exerciseNote.currentIdx + 1]
                                .weightRep[0][1]
                            : currentWorkout[exerciseNote.currentIdx].weightRep[
                                exerciseNote.currentSetIdx + 1
                              ][1])}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
            {!isWorkoutStart && (
              <div className="text-text-main flex grow items-center justify-center text-2xl">
                <button
                  onClick={showPlanListHandler}
                  className="border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease cursor-pointer rounded-xl border-2 px-4 py-2 transition-colors duration-300 active:scale-96"
                >
                  {currentPlan.planName}
                </button>
              </div>
            )}
            {isWorkoutStart && (
              <Timer
                pauseWorkout={pauseWorkout}
                isWorkoutStart={isWorkoutStart}
                currentPlan={currentPlan}
                currentWorkout={currentWorkout}
                isWorkoutComplete={isWorkoutComplete}
                exerciseNote={exerciseNote}
              />
            )}
            <div
              className={`flex h-1/4 w-full justify-center ${!isWorkoutStart && "hidden"}`}
            >
              <button
                onClick={nextHandler}
                className="border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease text-text-main h-20 w-30 cursor-pointer overflow-y-auto rounded-xl border-2 px-4 py-2 text-2xl transition-colors duration-300 active:scale-96"
              >
                Next
              </button>
            </div>

            <div
              className={`text-text-main flex w-full items-center pb-4 ${!isWorkoutStart ? "justify-around" : "justify-between"} overflow-x-auto px-4 text-xl sm:justify-center sm:gap-10`}
            >
              {isWorkoutStart && (
                <button
                  onClick={() => {
                    setPauseWorkout(true);
                    setShowConfirm(true);
                    setShowWorkoutList(false);
                  }}
                  className="border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease cursor-pointer rounded-xl border-2 px-4 py-2 transition-colors duration-300 active:scale-96"
                >
                  Stop
                </button>
              )}
              {isWorkoutStart && (
                <button
                  onClick={pauseWorkoutHandler}
                  className="border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease cursor-pointer rounded-xl border-2 px-4 py-2 transition-colors duration-300 active:scale-96"
                >
                  {pauseWorkout ? "Continue" : "Pause"}
                </button>
              )}
              {!isWorkoutStart && (
                <button
                  onClick={startWorkoutHandler}
                  className="border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease cursor-pointer rounded-xl border-2 px-4 py-2 transition-colors duration-300 active:scale-96"
                >
                  Start
                </button>
              )}
              <button
                onClick={showWorkoutListHandler}
                className="border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease cursor-pointer rounded-xl border-2 px-4 py-2 transition-colors duration-300 active:scale-96"
              >
                List
              </button>
            </div>
          </div>

          <WorkoutExerciseList
            showWorkoutList={showWorkoutList}
            showWorkoutListHandler={showWorkoutListHandler}
            currentWorkout={currentWorkout}
            setCurrentWorkout={setCurrentWorkout}
            exerciseNote={exerciseNote}
          />
        </div>
      )}
    </div>
  );
}
