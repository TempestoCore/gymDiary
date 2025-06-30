import type { PlanType } from "../../types";
import { useUserContext } from "../useUserContext";
import { useState } from "react";
interface PropsType {
  setCurrentPlan: React.Dispatch<React.SetStateAction<PlanType>>;
}
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
export function ChoosePlan({ setCurrentPlan }: PropsType) {
  const { userData } = useUserContext();
  const [note, setNote] = useState("");
  const [selectCurrentPlan, setSelectCurrentPlan] = useState(
    userData.planList[0]
  );
  const selectCurrentPlanHandler = () => {
    const now = new Date();
    if (
      selectCurrentPlan[daysOfWeek[now.getDay()] as WeekdayKeys].length == 0
    ) {
      setNote(
        "This plan for today have not a workout. Change this plan or choose another."
      );
      return;
    }
    setNote("");
    setCurrentPlan(selectCurrentPlan);
  };
  return (
    <div className="grow flex flex-col items-center justify-center gap-10 text-text-main text-2xl">
      {!selectCurrentPlan ? (
        <h2>For start your workout create a new plan.</h2>
      ) : (
        <>
          <h2>Choose your plan for workout:</h2>
          <select
            onChange={(e) => {
              setNote("");
              setSelectCurrentPlan(userData.planList[Number(e.target.value)]);
            }}
            className="w-100 text-center cursor-pointer bg-bg-secondary outline-none"
          >
            {userData.planList.map((elem, idx) => (
              <option key={elem.planName + idx} value={idx}>
                {elem.planName}
              </option>
            ))}
          </select>
          {note && <h2 className="text-error text-2xl text-center">{note}</h2>}
          <button
            onClick={selectCurrentPlanHandler}
            className="border-2 py-2 px-4 border-border rounded-xl cursor-pointer hover:border-button-hover"
          >
            Select
          </button>
        </>
      )}
    </div>
  );
}
