import type { PlanType } from "../../types";
import { useUserContext } from "../useUserContext";
type WeekdayKeys =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
interface PropsType {
  showPlanList: boolean;
  showPlanListHandler: () => void;
  setCurrentPlan: React.Dispatch<React.SetStateAction<PlanType>>;
  currentPlan: PlanType;
  currentDay: WeekdayKeys;
}
export function ChooseWorkoutPlan({
  showPlanList,
  showPlanListHandler,
  setCurrentPlan,
  currentPlan,
  currentDay,
}: PropsType) {
  const { userData } = useUserContext();
  const changeCurrentPlanHandler = (idx: number) => {
    setCurrentPlan(() => {
      const newPlan = JSON.parse(JSON.stringify(userData.planList[idx]));
      return newPlan;
    });
  };
  return (
    <div
      className={`bg-bg absolute flex flex-col ${showPlanList ? "h-full" : "h-0"} ease text-text-main z-9 w-full items-center justify-center overflow-y-hidden text-2xl transition-[height] duration-300`}
    >
      <span className="pt-10">{currentDay}</span>
      <span className="pt-10">Selected plan: {currentPlan.planName}</span>
      <div className="flex h-9/10 w-full items-center justify-center">
        <div className="border-border bg-bg-secondary flex h-4/5 w-4/5 flex-col items-center overflow-y-auto border-2">
          {userData.planList.map((elem, idx) => (
            <span
              onClick={() => changeCurrentPlanHandler(idx)}
              className={`${elem[currentDay].length === 0 && "text-text-secondary pointer-events-none"} hover:bg-button-hover active:bg-button-hover flex h-15 items-center justify-center ${currentPlan?.planName === elem.planName && "font-bold"} ease w-full cursor-pointer truncate text-center transition-colors duration-300`}
              key={elem.planName + idx}
            >
              {elem.planName}
            </span>
          ))}
        </div>
      </div>
      <button
        onClick={showPlanListHandler}
        className="border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease mb-4 cursor-pointer rounded-xl border-2 px-4 py-2 transition-colors duration-300 active:scale-96"
      >
        Select
      </button>
    </div>
  );
}
