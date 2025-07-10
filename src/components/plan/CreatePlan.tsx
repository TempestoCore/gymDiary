import { useState } from "react";
import type { PlanType } from "../../types";
import { updateUserPlans } from "../../supabase-client";
import { useUserContext } from "../useUserContext";
interface PropsType {
  setPlanList: React.Dispatch<React.SetStateAction<PlanType[]>>;
  setCreateNewPlan: React.Dispatch<React.SetStateAction<boolean>>;
  createNewPlan: boolean;
}
export function CreatePlan({
  setPlanList,
  setCreateNewPlan,
  createNewPlan,
}: PropsType) {
  const { userData, setUserData } = useUserContext();
  const [create, setCreate] = useState(false);
  const [planName, setPlanName] = useState("");
  const [createPlanNote, setCreatePlanNote] = useState("");
  const saveHandler = () => {
    if (planName == "") {
      setCreatePlanNote("Plan name can not be empty");
      return;
    }
    if (userData.planList) {
      for (let i = 0; i <= userData.planList.length - 1; i++) {
        if (userData.planList[i].planName === planName) {
          setCreatePlanNote("Plan with the same name already exist");
          return;
        }
      }
    }
    setPlanList((prev) => {
      const newPlanList = [
        ...prev,
        {
          planName: planName,
          comment: "",
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: [],
        },
      ];
      setUserData((prev) => ({ ...prev, planList: newPlanList }));
      updateUserPlans(newPlanList);
      return newPlanList;
    });
    setCreatePlanNote("");
    setCreateNewPlan(false);
  };
  return (
    <>
      {!create && !createNewPlan ? (
        <div className="flex grow flex-col items-center justify-center">
          <button
            onClick={() => setCreate(true)}
            className="border-border bg-bg-secondary text-text-main hover:bg-button-hover rounded-xl border-2 px-10 py-5 text-2xl transition-colors duration-300"
          >
            Create a new plan.
          </button>
        </div>
      ) : (
        <div className="flex grow flex-col items-center justify-center">
          <input
            onKeyDown={(e) => {
              if (e.key == "Enter") saveHandler();
            }}
            onChange={(e) => {
              setPlanName(e.target.value);
            }}
            value={planName}
            className="text-text-main bg-bg-secondary border-border h-15 w-100 rounded-xl border-2 px-2 text-xl outline-none"
            type="text"
            placeholder="Plan name..."
          />
          <div className="flex w-full justify-center gap-10 pt-10">
            <button
              onClick={saveHandler}
              className="border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease text-text-main cursor-pointer rounded-xl border-2 px-4 py-2 text-2xl transition-colors duration-300 active:scale-96"
            >
              Save
            </button>
            <button
              onClick={() => {
                setCreateNewPlan(false);
              }}
              className="border-border bg-bg-secondary active:border-error hover:border-error active:bg-error ease text-text-main cursor-pointer rounded-xl border-2 px-4 py-2 text-2xl transition-colors duration-300 active:scale-96"
            >
              Close
            </button>
          </div>
          {createPlanNote && (
            <span className="text-error text-xl">{createPlanNote}</span>
          )}
        </div>
      )}
    </>
  );
}
