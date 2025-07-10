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
  const { setCurrentPlanIdx, currentPlanIdx } = useUserContext();
  const [selecteedIdx, setSelectedIdx] = useState(currentPlanIdx);

  return (
    <div className={`relative z-10`}>
      <button
        onClick={() => setShowList(true)}
        className="text-text-secondary hover:text-button cursor-pointer pl-4 text-2xl transition-colors duration-300"
      >
        List
      </button>
      {showList && (
        <div
          onClick={() => setShowList(false)}
          className="fixed top-0 left-0 h-screen w-screen"
        ></div>
      )}
      {showList ? (
        <div className="bg-bg-secondary border-border fixed top-15 flex h-full w-full flex-col items-center justify-center">
          {planList.map((elem, idx) => (
            <div
              key={elem.planName + Math.random()}
              className={`text-text-main border-border hover:bg-button-hover w-1/2 cursor-pointer overflow-hidden border-b-2 text-center text-xl ${selecteedIdx === idx && "font-bold"}`}
              onClick={() => {
                setSelectedIdx(idx);
              }}
            >
              {elem.planName}
            </div>
          ))}
          <div className="flex w-full justify-center gap-10">
            <button
              onClick={() => {
                setCreateNewPlan(true);
              }}
              className="text-text-main bg-bg-secondary border-border hover:bg-button-hover mt-4 cursor-pointer rounded-xl border-2 px-4 py-2 text-2xl transition-colors duration-300 active:scale-96"
            >
              Add
            </button>
            <button
              onClick={() => {
                setCurrentPlan(selecteedIdx);
                setCurrentPlanIdx(selecteedIdx);
                updateCurrentPlan(selecteedIdx);
                setShowList(false);
              }}
              className="text-text-main bg-bg-secondary border-border hover:bg-button-hover mt-4 cursor-pointer rounded-xl border-2 px-4 py-2 text-2xl transition-colors duration-300 active:scale-96"
            >
              Select
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
