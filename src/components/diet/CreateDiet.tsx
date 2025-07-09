import { useState } from "react";
import type { DietType } from "../../types";
import { updateUserDietList } from "../../supabase-client";
import { useUserContext } from "../useUserContext";
import { updateCurrentDiet } from "../../supabase-client";
interface PropsType {
  setCreateNewDiet: React.Dispatch<React.SetStateAction<boolean>>;
  setDietList: React.Dispatch<React.SetStateAction<[] | DietType[]>>;
  setCurrentDiet: React.Dispatch<React.SetStateAction<number | undefined>>;
}
export function CreateDiet({
  setCreateNewDiet,
  setDietList,
  setCurrentDiet,
}: PropsType) {
  const { userData, setUserData } = useUserContext();
  const { setCurrentDietIdx } = useUserContext();
  const [dietName, setDietName] = useState("");
  const [createNote, setCreateNote] = useState("");
  const saveHandler = () => {
    if (dietName.length == 0) {
      setCreateNote("Diet name is empty.");
      return;
    }
    let lengthOfDietList = 0;
    setDietList((prev) => {
      lengthOfDietList = prev.length;
      const newDietList = [
        ...prev,
        {
          dietName: dietName,
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: [],
        },
      ];
      updateUserDietList(JSON.stringify(newDietList));
      setUserData((prev) => ({ ...prev, dietList: newDietList }));
      return newDietList;
    });
    setCurrentDiet(lengthOfDietList);
    setCurrentDietIdx(lengthOfDietList);
    updateCurrentDiet(lengthOfDietList);
    setCreateNewDiet(false);
  };
  return (
    <div className="relative flex w-full grow flex-col items-center justify-center">
      <div className="text-text-main absolute top-5 right-5 text-2xl">
        {userData.dietList.length > 0 && (
          <span
            onClick={() => setCreateNewDiet(false)}
            className="hover:text-error active:text-error cursor-pointer"
          >
            Close
          </span>
        )}
      </div>
      <input
        onKeyDown={(e) => {
          if (e.key == "Enter") saveHandler();
        }}
        onChange={(e) => {
          setDietName(e.target.value);
        }}
        value={dietName}
        className="text-text-main bg-bg-secondary border-border h-15 w-9/10 rounded-xl border-2 px-2 text-xl outline-none md:w-2/5"
        type="text"
        placeholder="Diet name..."
      />
      <button
        onClick={saveHandler}
        className="text-text-main bg-bg-secondary border-border hover:bg-button-hover mt-4 rounded-xl border-2 px-10 py-5 text-2xl transition-colors duration-300"
      >
        Create a new diet
      </button>
      {createNote && <span className="text-error text-xl">{createNote}</span>}
    </div>
  );
}
