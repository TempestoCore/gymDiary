import type { DietType } from "../../types";
import { updateCurrentDiet } from "../../supabase-client";
import { useUserContext } from "../useUserContext";
interface PropsType {
  setSelectDiet: React.Dispatch<React.SetStateAction<boolean>>;
  dietList: [] | DietType[];
  setCurrentDiet: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export function SelectDiet({
  setSelectDiet,
  dietList,
  setCurrentDiet,
}: PropsType) {
  const { setCurrentDietIdx } = useUserContext();
  const selectDietHandler = (idx: number) => {
    setCurrentDiet(idx);
    setCurrentDietIdx(idx);
    updateCurrentDiet(idx);
    setSelectDiet(false);
  };
  return (
    <div className="flex flex-col justify-center items-center grow">
      <div className="flex flex-col justify-center items-center border-2 border-border rounded-xl w-100 text-2xl text-text-main bg-bg-secondary">
        {dietList.map((elem, idx) => (
          <span
            key={elem.dietName + idx}
            className={`w-full text-center cursor-pointer hover:bg-button-hover ${
              idx == 0 ? "rounded-t-xl" : ""
            } ${dietList.length - 1 == idx ? "rounded-b-xl" : ""}`}
            onClick={() => selectDietHandler(idx)}
          >
            {elem.dietName}
          </span>
        ))}
      </div>
    </div>
  );
}
