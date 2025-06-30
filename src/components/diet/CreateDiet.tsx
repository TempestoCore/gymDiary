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
    <div className="flex relative flex-col justify-center items-center grow">
      <div className="absolute top-5 right-5 text-2xl text-text-main">
        {userData.dietList.length > 0 && (
          <span
            onClick={() => setCreateNewDiet(false)}
            className="cursor-pointer hover:text-error"
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
        className="w-100 h-15 text-text-main text-xl outline-none border-2 bg-bg-secondary border-border rounded-xl px-2"
        type="text"
        placeholder="Diet name..."
      />
      <button
        onClick={saveHandler}
        className="mt-4 py-5 px-10 text-text-main text-2xl border-2 bg-bg-secondary border-border rounded-xl hover:bg-button-hover transition-colors duration-300"
      >
        Create a new diet
      </button>
      {createNote && <span className="text-error text-xl">{createNote}</span>}
    </div>
  );
}
