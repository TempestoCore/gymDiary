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
}

export function AddMeal({
  currentDay,
  setOpenAddMeal,
  setDietList,
  currentDiet,
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
    <div className="flex grow justify-between gap-1">
      {openModalAddFood && (
        <>
          <div className="fixed top-0 left-0 z-100 w-full h-full opacity-50 bg-black"></div>
          <div className="fixed top-0 left-0 z-100 w-full h-full flex justify-center items-center">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="relative flex flex-col items-center z-200 bg-bg border-2 border-border text-2xl text-text-main"
            >
              <span
                onClick={() => setOpenModalAddFood(false)}
                className="absolute top-0 right-5 cursor-pointer hover:text-error"
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
                <div className="flex flex-col gap-1 w-2/10">
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
                  className="cursor-pointer px-4 py-2 border-2 rounded-xl border-border hover:border-button-hover"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <FoodList
        addMeal={addMeal}
        setAddMeal={setAddMeal}
        setOpenModalAddFood={setOpenModalAddFood}
      />
      <div className="w-1/2 relative flex flex-col grow items-center text-text-main text-xl">
        <div>
          <span
            onClick={() => setOpenAddMeal(false)}
            className="text-text-main text-2xl absolute top-0 right-2 cursor-pointer hover:text-error"
          >
            Close
          </span>
        </div>
        <div className="text-2xl">Meal</div>
        <div>
          <button
            onClick={saveMealHandler}
            className="cursor-pointer border-2 border-border rounded-xl px-4 py-2 hover:border-button-hover"
          >
            Save Meal
          </button>
        </div>
        <div className="h-7 text-error">{saveMealNote}</div>
        <div className="flex flex-col grow w-full border-2 border-border h-30 overflow-y-scroll">
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
            className="bg-bg-secondary w-full text-text-main text-xl px-1 outline-none border-b-2 border-border"
          />
          {addMeal.meal.map((elem, idx) => (
            <div
              className="flex justify-between cursor-pointer hover:bg-bg-secondary"
              key={Object.keys(elem[1])[0] + idx}
            >
              <div
                onClick={() => removeFoodFromMeal(idx)}
                className="flex justify-center w-full truncate"
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
  );
}
