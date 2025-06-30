import type { ExerciseType, PlanType } from "../../types";
import { List } from "./List";
import { CreatePlan } from "./CreatePlan";
import { useState } from "react";
import { Exercise } from "./Exercise";
import { updateUserPlans } from "../../supabase-client";
import { useUserContext } from "../useUserContext";
type DayType =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

const dayOfWeek: DayType[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export function Plan() {
  const { userData, currentPlanIdx } = useUserContext();
  const defaultPlanList = userData.planList || [];
  const [planList, setPlanList] = useState<PlanType[]>(defaultPlanList);
  const [currentPlan, setCurrentPlan] = useState(currentPlanIdx);
  const [currentDay, setCurrentDay] = useState<DayType>("Monday");
  const [createNewPlan, setCreateNewPlan] = useState(false);
  const [edit, setEdit] = useState(false);

  return (
    <div className="grow flex flex-col ">
      {planList.length == 0 || createNewPlan ? (
        <CreatePlan
          setPlanList={setPlanList}
          createNewPlan={createNewPlan}
          setCreateNewPlan={setCreateNewPlan}
        />
      ) : (
        <div className="flex flex-col">
          <div className="w-full flex justify-between">
            <List
              planList={planList}
              setCreateNewPlan={setCreateNewPlan}
              setCurrentPlan={setCurrentPlan}
            />
            <button
              onClick={() => {
                if (edit) {
                  console.log(planList);
                  updateUserPlans(planList);
                }
                setEdit((prev) => !prev);
              }}
              className="text-text-secondary text-2xl cursor-pointer pr-4 hover:text-button transition-colors duration-300"
            >
              {`${edit ? "Save" : "Edit"}`}
            </button>
          </div>
          <h2 className="text-text-main text-3xl text-center overflow-hidden">
            {planList[currentPlan].planName}
          </h2>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {dayOfWeek.map((elem) => (
              <button
                onClick={() => {
                  setCurrentDay(elem);
                }}
                className={`border-2 px-2 ${
                  currentDay == elem
                    ? "bg-button-hover"
                    : planList[currentPlan][elem].length == 0
                    ? "bg-bg-secondary"
                    : "bg-button"
                } border-border cursor-pointer rounded-xl text-text-main text-xl hover:bg-button-hover transition-colors duration-200`}
                key={elem}
              >
                {elem}
              </button>
            ))}
          </div>
          <div className="flex flex-col items-center">
            {planList[currentPlan][currentDay].map((elem, idx) => (
              <Exercise
                elem={elem}
                edit={edit}
                setPlanList={setPlanList}
                currentPlan={currentPlan}
                currentDay={currentDay}
                idx={idx}
                key={idx}
              />
            ))}
          </div>
          <div className="w-full flex justify-center items-center">
            {edit ? (
              <div
                onClick={() => {
                  setPlanList((prev) => {
                    console.log("Добавление упражнения");
                    console.log(planList);
                    const newArr = [...prev];
                    const newExercise: ExerciseType = {
                      exerciseName: `Exercise - ${newArr[currentPlan][currentDay].length}`,
                      weightRep: [[0, 0]],
                    };
                    (newArr[currentPlan][currentDay] as ExerciseType[]).push(
                      newExercise
                    );
                    return newArr;
                  });
                }}
                className="border-2 select-none cursor-pointer border-border text-2xl text-text-main px-4 py-2 mt-4 rounded-xl hover:bg-button-hover transition-colors duration-300"
              >
                Add a new exercise
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col items-center mt-4">
            <label
              className="text-text-main text-2xl select-none"
              htmlFor="comment"
            >
              Comment
            </label>
            <textarea
              value={planList[currentPlan].comment}
              disabled={!edit}
              onChange={(e) => {
                setPlanList((prev) => {
                  const newPlanList = [...prev];
                  newPlanList[currentPlan].comment = e.target.value;
                  return newPlanList;
                });
              }}
              id="comment"
              className={`border-2 text-text-main text-xl border-border bg-bg-secondary px-2 w-1/2 min-h-50`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
