import type { DietType } from "../../types";
import { updateCurrentDiet } from "../../supabase-client";
import { useUserContext } from "../useUserContext";
import { useState } from "react";
interface PropsType {
  setSelectDiet: React.Dispatch<React.SetStateAction<boolean>>;
  dietList: [] | DietType[];
  setCurrentDiet: React.Dispatch<React.SetStateAction<number | undefined>>;
  setDietList: React.Dispatch<React.SetStateAction<[] | DietType[]>>;
}

export function SelectDiet({
  setSelectDiet,
  dietList,
  setCurrentDiet,
  setDietList,
}: PropsType) {
  const { setCurrentDietIdx, currentDietIdx } = useUserContext();
  const [dietIdx, setDietIdx] = useState(currentDietIdx);
  const selectDietHandler = (idx: number) => {
    setCurrentDiet(idx);
    setCurrentDietIdx(idx);
    updateCurrentDiet(idx);
    setSelectDiet(false);
  };
  const deleteHandler = (idx: number) => {
    setDietList((prev) => {
      const newData = [...prev].filter((elem, elemIdx) => {
        if (idx != elemIdx) return elem;
      });
      return newData;
    });
  };
  return (
    <div className="flex w-full grow flex-col items-center justify-center">
      <div className="border-border text-text-main bg-bg-secondary flex h-2/4 w-9/10 flex-col items-center justify-center overflow-auto rounded-xl border-2 text-2xl md:w-2/5">
        {dietList.map((elem, idx) => (
          <span
            key={elem.dietName + idx}
            className={`hover:bg-button-hover active:bg-button-hover ${dietIdx === idx && "font-bold"} w-full cursor-pointer text-center`}
            onClick={() => setDietIdx(idx)}
          >
            {elem.dietName}
          </span>
        ))}
      </div>
      <div className="flex gap-10 pt-10">
        <span
          onClick={() => {
            deleteHandler(dietIdx);
          }}
          className="border-border text-text-main bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease cursor-pointer rounded-xl border-2 px-4 py-2 text-2xl transition-colors duration-300 active:scale-96"
        >
          Delete
        </span>
        <span
          onClick={() => selectDietHandler(dietIdx)}
          className="border-border text-text-main bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease cursor-pointer rounded-xl border-2 px-4 py-2 text-2xl transition-colors duration-300 active:scale-96"
        >
          Select
        </span>
      </div>
    </div>
  );
}
