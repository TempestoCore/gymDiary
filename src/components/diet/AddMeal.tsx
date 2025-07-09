import { FoodList } from "./FoodList";
import { useState } from "react";
import { useUserContext } from "../useUserContext";
import type { FoodType, MealType, DietType } from "../../types";
import { updateUserDietList, updateUserFoodList } from "../../supabase-client";
interface PropsType {
  currentDay:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  currentDiet: number | undefined;
  setOpenAddMeal: React.Dispatch<React.SetStateAction<boolean>>;
  setDietList: React.Dispatch<React.SetStateAction<[] | DietType[]>>;
  sidebarIsOpen: boolean;
}

export function AddMeal({
  currentDay,
  setOpenAddMeal,
  setDietList,
  currentDiet,
  sidebarIsOpen,
}: PropsType) {
  const { userData, setUserData } = useUserContext();
  const [openModalAddFood, setOpenModalAddFood] = useState(false);
  const [saveMealNote, setSaveMealNote] = useState("");
  const [addMeal, setAddMeal] = useState<MealType>({
    meal: [],
    mealName: "",
    comment: "",
  });
  const [addFood, setAddFood] = useState({
    name: "",
    prot: 0,
    carbs: 0,
    fats: 0,
    kcal: 0,
  });
  const [addFoodNote, setAddFoodNote] = useState("");

  const saveAddFoodHandler = () => {
    if (addFood.name.length === 0) {
      setAddFoodNote("Food name can't be empty");
      return;
    }
    if (addFood.name.length > 20) {
      setAddFoodNote("Food name too long");
      return;
    }
    let reapedName = false;
    userData.foodList.forEach((elem) => {
      if (Object.keys(elem)[0] === addFood.name) {
        console.log(Object.keys(elem)[0] + " " + addFood.name);
        reapedName = true;
        return;
      }
    });

    if (reapedName) {
      setAddFoodNote("Food with same name already saved");
      return;
    }

    setUserData((prev) => {
      const newFood: FoodType = {
        [addFood.name]: {
          proteins: addFood.prot,
          fats: addFood.fats,
          carbohydrates: addFood.carbs,
          kcal: addFood.kcal,
        },
      };
      const newFoodList = [...prev.foodList, newFood];
      updateUserFoodList(JSON.stringify(newFoodList));
      return { ...prev, foodList: newFoodList };
    });
    setAddFood({
      name: "",
      prot: 0,
      carbs: 0,
      fats: 0,
      kcal: 0,
    });
    setAddFoodNote("");
    setOpenModalAddFood(false);
  };

  const showMealSummary = (meal: MealType) => {
    let prot = 0;
    let carbs = 0;
    let fat = 0;
    let kcal = 0;
    const mealFood = [...meal.meal];
    for (let i = 0; i <= mealFood.length - 1; i++) {
      prot +=
        (mealFood[i][0] / 100) *
        mealFood[i][1][Object.keys(mealFood[i][1])[0]].proteins;
      carbs +=
        (mealFood[i][0] / 100) *
        mealFood[i][1][Object.keys(mealFood[i][1])[0]].carbohydrates;
      fat +=
        (mealFood[i][0] / 100) *
        mealFood[i][1][Object.keys(mealFood[i][1])[0]].fats;
      kcal +=
        (mealFood[i][0] / 100) *
        mealFood[i][1][Object.keys(mealFood[i][1])[0]].kcal;
    }
    return (
      <div className="flex flex-col items-center">
        <span>Summary:</span>
        <span>Prot - {prot.toFixed(1)} grams</span>
        <span>Carbs - {carbs.toFixed(1)} grams</span>
        <span>Fat - {fat.toFixed(1)} grams</span>
        <span>Kcal - {kcal.toFixed(1)} grams</span>
      </div>
    );
  };

  const saveMealHandler = () => {
    if (currentDiet == undefined) return;
    if (addMeal.mealName.length === 0) {
      setSaveMealNote("Meal name can't be empty");
      return;
    }
    setDietList((prev) => {
      const newDietList = [...prev];
      const newCurrentDiet = { ...newDietList[currentDiet] };
      const weekdayMeals = [...newCurrentDiet[currentDay], addMeal];
      newCurrentDiet[currentDay] = weekdayMeals;
      newDietList[currentDiet] = newCurrentDiet;
      updateUserDietList(JSON.stringify(newDietList));
      setUserData((prev) => {
        return { ...prev, dietList: newDietList };
      });
      return newDietList;
    });
    setOpenAddMeal(false);
  };

  const removeFoodFromMeal = (idx: number) => {
    setAddMeal((prev) => {
      const newAddMeal = { ...prev };
      const newFoodList = prev.meal.filter((_, foodIdx) => {
        return foodIdx != idx;
      });
      newAddMeal.meal = newFoodList;
      return newAddMeal;
    });
  };

  return (
    <div className="flex grow flex-col justify-between gap-1">
      {openModalAddFood && (
        <>
          <div className="fixed top-0 left-0 z-100 h-full w-full bg-black opacity-50"></div>
          <div className="fixed top-0 left-0 z-100 flex h-full w-full items-center justify-center">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="bg-bg border-border text-text-main relative z-200 flex flex-col items-center border-2 py-5 text-2xl"
            >
              <span
                onClick={() => setOpenModalAddFood(false)}
                className="hover:text-error absolute top-0 right-5 cursor-pointer"
              >
                Close
              </span>
              <label htmlFor="Food_name">Food Name</label>
              <input
                onChange={(e) => {
                  setAddFood((prev) => ({ ...prev, name: e.target.value }));
                }}
                id="Food_name"
                autoComplete="off"
                className="input px-1"
                placeholder="Food name..."
                type="text"
                value={addFood.name}
              />
              <span className="text-error text-xl">{addFoodNote}</span>
              <span className="py-4">Enter nutrients per 100 grams</span>
              <div className="flex justify-center gap-10">
                <div className="flex flex-col gap-1">
                  <label htmlFor="Proteins">Proteins:</label>
                  <label htmlFor="Fats">Fats:</label>
                  <label htmlFor="Carbons">Carbons:</label>
                  <label htmlFor="Kcal">Kcal:</label>
                </div>
                <div className="flex w-2/10 flex-col gap-1">
                  <input
                    onChange={(e) => {
                      if (Number(e.target.value) < 0) return;
                      setAddFood((prev) => ({
                        ...prev,
                        prot: Number(e.target.value),
                      }));
                    }}
                    id="Proteins"
                    className="input"
                    type="number"
                    value={addFood.prot}
                  />
                  <input
                    onChange={(e) => {
                      if (Number(e.target.value) < 0) return;
                      setAddFood((prev) => ({
                        ...prev,
                        fats: Number(e.target.value),
                      }));
                    }}
                    id="Fats"
                    className="input"
                    type="number"
                    value={addFood.fats}
                  />
                  <input
                    onChange={(e) => {
                      if (Number(e.target.value) < 0) return;
                      setAddFood((prev) => ({
                        ...prev,
                        carbs: Number(e.target.value),
                      }));
                    }}
                    id="Carbons"
                    className="input"
                    type="number"
                    value={addFood.carbs}
                  />
                  <input
                    onChange={(e) => {
                      if (Number(e.target.value) < 0) return;
                      setAddFood((prev) => ({
                        ...prev,
                        kcal: Number(e.target.value),
                      }));
                    }}
                    id="Kcal"
                    className="input"
                    type="number"
                    value={addFood.kcal}
                  />
                </div>
              </div>
              <div className="py-4">
                <button
                  onClick={saveAddFoodHandler}
                  className="border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease cursor-pointer rounded-xl border-2 px-4 py-2 transition-colors duration-300 active:scale-96"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="flex w-full grow">
        <FoodList
          sidebarIsOpen={sidebarIsOpen}
          addMeal={addMeal}
          setAddMeal={setAddMeal}
          setOpenModalAddFood={setOpenModalAddFood}
        />
        <div className="text-text-main relative flex w-1/2 grow flex-col items-center text-xl">
          <div className="text-2xl">Meal</div>
          <div>
            <button
              onClick={saveMealHandler}
              className="border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease cursor-pointer rounded-xl border-2 px-4 py-2 text-2xl transition-colors duration-300 active:scale-96"
            >
              Save Meal
            </button>
          </div>
          <div className="text-error h-7">{saveMealNote}</div>
          <div className="border-border flex h-30 w-full grow flex-col overflow-y-auto border-2">
            <input
              onChange={(e) => {
                setAddMeal((prev) => {
                  const newMeal = { ...prev };
                  newMeal.mealName = e.target.value;
                  return newMeal;
                });
              }}
              value={addMeal.mealName}
              placeholder="Meal name..."
              className="bg-bg-secondary text-text-main border-border w-full border-b-2 px-1 text-xl outline-none"
            />
            {addMeal.meal.map((elem, idx) => (
              <div
                className="hover:bg-bg-secondary flex cursor-pointer justify-between"
                key={Object.keys(elem[1])[0] + idx}
              >
                <div
                  onClick={() => removeFoodFromMeal(idx)}
                  className="flex w-full justify-center truncate"
                >
                  <span>{Object.keys(elem[1])[0]}</span>
                </div>
                <input
                  onChange={(e) => {
                    setAddMeal((prev) => {
                      const newAddMeal = { ...prev };
                      const newMealFoodList = [...prev.meal];
                      newMealFoodList[idx][0] = Number(e.target.value);
                      newAddMeal.meal = newMealFoodList;
                      return newAddMeal;
                    });
                  }}
                  className="w-1/4"
                  value={elem[0]}
                  type="number"
                />
              </div>
            ))}
            {showMealSummary(addMeal)}
          </div>
        </div>
      </div>
      <div className="flex h-1/10 w-full items-center justify-center">
        <span
          onClick={() => setOpenAddMeal(false)}
          className="border-border bg-bg-secondary active:border-error hover:border-error active:bg-error text-text-main ease cursor-pointer rounded-xl border-2 px-4 py-2 text-2xl transition-colors duration-300 active:scale-96"
        >
          Close
        </span>
      </div>
    </div>
  );
}
