import { useState } from "react";
import type { PlanType } from "../../types";
import { updateCurrentPlan } from "../../supabase-client";
import { useUserContext } from "../useUserContext";
interface PropsType {
  planList: PlanType[];
  setCreateNewPlan: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentPlan: React.Dispatch<React.SetStateAction<number>>;
}
export function List({
  planList,
  setCreateNewPlan,
  setCurrentPlan,
}: PropsType) {
  const [showList, setShowList] = useState(false);
  const { setCurrentPlanIdx } = useUserContext();
  return (
    <div className={`relative z-10`}>
      <button
        onClick={() => setShowList(true)}
        className="text-text-secondary text-2xl cursor-pointer pl-4 hover:text-button transition-colors duration-300"
      >
        List
      </button>
      {showList && (
        <div
          onClick={() => setShowList(false)}
          className="fixed w-screen h-screen top-0 left-0"
        ></div>
      )}
      {showList ? (
        <div className="flex flex-col fixed top-15 left-0 bottom-0 min-w-50 max-w-1/2  bg-bg-secondary border-r-2 border-border">
          {planList.map((elem, idx) => (
            <div
              key={elem.planName + Math.random()}
              className="text-text-main overflow-hidden text-xl cursor-pointer border-b-2 border-border hover:bg-button-hover  text-center"
              onClick={() => {
                setCurrentPlan(idx);
                setCurrentPlanIdx(idx);
                updateCurrentPlan(idx);
                setShowList(false);
              }}
            >
              {elem.planName}
            </div>
          ))}
          <div
            onClick={() => {
              setCreateNewPlan(true);
            }}
            className="cursor-pointer text-text-main text-xl border-border bg-button hover:bg-button-hover transition-colors duration-300 text-center"
          >
            Add
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
