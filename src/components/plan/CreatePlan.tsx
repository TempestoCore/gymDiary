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
        <div className="flex flex-col justify-center items-center grow">
          <button
            onClick={() => setCreate(true)}
            className="py-5 px-10 border-2 border-border bg-bg-secondary text-text-main text-2xl rounded-xl hover:bg-button-hover transition-colors duration-300"
          >
            Create a new plan.
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center grow">
          <input
            onKeyDown={(e) => {
              if (e.key == "Enter") saveHandler();
            }}
            onChange={(e) => {
              setPlanName(e.target.value);
            }}
            value={planName}
            className="w-100 h-15 text-text-main text-xl outline-none border-2 bg-bg-secondary border-border rounded-xl px-2"
            type="text"
            placeholder="Plan name..."
          />
          <button
            onClick={saveHandler}
            className="mt-4 py-5 px-10 text-text-main text-2xl border-2 bg-bg-secondary border-border rounded-xl hover:bg-button-hover transition-colors duration-300"
          >
            Save
          </button>
          {createPlanNote && (
            <span className="text-error text-xl">{createPlanNote}</span>
          )}
        </div>
      )}
    </>
  );
}
