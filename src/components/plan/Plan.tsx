import type { ExerciseType, PlanType } from "../../types";
import { List } from "./List";
import { CreatePlan } from "./CreatePlan";
import { useState, useEffect } from "react";
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
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const dayOfWeekShort = [
  "Mo", // Monday
  "Tu", // Tuesday
  "We", // Wednesday
  "Th", // Thursday
  "Fr", // Friday
  "Sa", // Saturday
  "Su", // Sunday
];

export function Plan() {
  const { userData, currentPlanIdx } = useUserContext();
  const defaultPlanList = userData.planList || [];
  const [planList, setPlanList] = useState<PlanType[]>(defaultPlanList);
  const [currentPlan, setCurrentPlan] = useState(currentPlanIdx);
  const [currentDay, setCurrentDay] = useState<DayType>(
    daysOfWeek[new Date().getDay()] as DayType,
  );
  const [createNewPlan, setCreateNewPlan] = useState(false);
  const [edit, setEdit] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-[calc(100%-60px)] flex-col overflow-y-auto">
      {planList.length == 0 || createNewPlan ? (
        <CreatePlan
          setPlanList={setPlanList}
          createNewPlan={createNewPlan}
          setCreateNewPlan={setCreateNewPlan}
        />
      ) : (
        <div className="flex flex-col">
          <div className="border-border text-text-main flex h-14 justify-around border-b-2 text-xl">
            {dayOfWeek.map((elem, idx) => (
              <button
                onClick={() => {
                  setCurrentDay(elem);
                }}
                className={`cursor-pointer ${
                  currentDay == daysOfWeek[idx < 6 ? idx + 1 : 0]
                    ? "text-button"
                    : ""
                } hover:text-button-hover transition-colors duration-300`}
                key={elem}
              >
                {windowWidth > 800 ? elem : dayOfWeekShort[idx]}
              </button>
            ))}
          </div>
          <div className="flex w-full justify-between">
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
              className="text-text-secondary hover:text-button cursor-pointer pr-4 text-2xl transition-colors duration-300"
            >
              {`${edit ? "Save" : "Edit"}`}
            </button>
          </div>
          <h2 className="text-text-main overflow-hidden text-center text-3xl">
            {planList[currentPlan].planName}
          </h2>

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
          <div className="flex w-full items-center justify-center">
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
                      newExercise,
                    );
                    return newArr;
                  });
                }}
                className="border-border text-text-main hover:bg-button-hover mt-4 cursor-pointer rounded-xl border-2 px-4 py-2 text-2xl transition-colors duration-300 select-none"
              >
                Add a new exercise
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="mt-4 flex flex-col items-center">
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
              className={`text-text-main border-border bg-bg-secondary min-h-50 w-1/2 border-2 px-2 text-xl`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
