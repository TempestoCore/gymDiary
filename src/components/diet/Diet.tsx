import { CreateDiet } from "./CreateDiet";
import { useState } from "react";
import { AddMeal } from "./AddMeal";
import { SelectDiet } from "./SelectDiet";
import { ContextMenu } from "./ContextMenu";
import type { DietType, MealType } from "../../types";
import { useUserContext } from "../useUserContext";
import { updateUserDietList } from "../../supabase-client";
type WeekdayKeys =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const dayOfWeekShort = [
  "Mo", // Monday
  "Tu", // Tuesday
  "We", // Wednesday
  "Th", // Thursday
  "Fr", // Friday
  "Sa", // Saturday
  "Su", // Sunday
];

export function Diet() {
  const { userData, currentDietIdx } = useUserContext();
  const [dietList, setDietList] = useState<DietType[] | []>(userData.dietList);
  const [currentDiet, setCurrentDiet] = useState<number | undefined>(
    currentDietIdx
  );
  const [createNewDiet, setCreateNewDiet] = useState(false);
  const [selectDiet, setSelectDiet] = useState(false);
  const [currentDay, setCurrentDay] = useState(
    daysOfWeek[new Date().getDay()] as WeekdayKeys
  );
  const [openAddMeal, setOpenAddMeal] = useState(false);
  const [menu, setMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    targetId: null | number;
  }>({
    visible: false,
    x: 0,
    y: 0,
    targetId: null,
  });

  const changeCurrentDayHandler = (idx: number) => {
    const trueIdx = idx < 6 ? idx + 1 : 0;
    setCurrentDay(daysOfWeek[trueIdx] as WeekdayKeys);
  };

  const nutrientsMealSum = (meal: MealType) => {
    const sum = { proteins: 0, fats: 0, carbohydrates: 0, kcal: 0 };
    meal.meal.forEach((elem) => {
      const foodNutrition = Object.values(elem[1])[0];
      const foodWeight = elem[0] / 100;
      sum.proteins += foodNutrition.proteins * foodWeight;
      sum.fats += foodNutrition.fats * foodWeight;
      sum.carbohydrates += foodNutrition.carbohydrates * foodWeight;
      sum.kcal += foodNutrition.kcal * foodWeight;
    });
    return sum;
  };

  const ContextMenuHandler = (
    e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>,
    idx: number
  ) => {
    e.preventDefault();
    setMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      targetId: idx,
    });
  };

  const mealDeleteHandler = () => {
    setDietList((prev) => {
      const newDietList = [...prev];
      const newMealList = [
        ...newDietList[currentDiet as number][currentDay],
      ].filter((_, idx) => {
        return idx != menu.targetId;
      });
      newDietList[currentDiet as number][currentDay] = newMealList;
      updateUserDietList(JSON.stringify(newDietList));
      return newDietList;
    });
  };
  const closeMenu = () => {
    setMenu({ ...menu, visible: false });
  };

  return (
    <div className="flex relative grow">
      {menu.visible && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          onDelete={mealDeleteHandler}
          onClose={closeMenu}
        />
      )}
      {createNewDiet || dietList.length == 0 ? (
        <CreateDiet
          setCurrentDiet={setCurrentDiet}
          setDietList={setDietList}
          setCreateNewDiet={setCreateNewDiet}
        />
      ) : openAddMeal ? (
        <AddMeal
          setDietList={setDietList}
          setOpenAddMeal={setOpenAddMeal}
          currentDay={currentDay}
          currentDiet={currentDiet}
        />
      ) : selectDiet ? (
        <SelectDiet
          setSelectDiet={setSelectDiet}
          dietList={dietList}
          setCurrentDiet={setCurrentDiet}
        />
      ) : (
        <div className="flex flex-col grow relative">
          <div className="flex justify-around border-b-2 h-14 border-border text-text-main text-xl">
            {dayOfWeekShort.map((elem, idx) => (
              <button
                onClick={() => {
                  changeCurrentDayHandler(idx);
                }}
                className={`cursor-pointer ${
                  currentDay == daysOfWeek[idx < 6 ? idx + 1 : 0]
                    ? "text-button"
                    : ""
                } hover:text-button-hover transition-colors duration-300`}
                key={elem + idx}
              >
                {elem}
              </button>
            ))}
          </div>
          <div className="flex justify-between px-4 text-xl text-text-main">
            <div className="flex flex-col">
              <span
                onClick={() => {
                  setSelectDiet(true);
                }}
                className=" cursor-pointer hover:text-button-hover transition-colors duration-300"
              >
                Select Diet
              </span>
              <span className="flex text-text-secondary text-xl justify-center">
                {dietList.length > 0 &&
                  dietList[currentDiet as number].dietName}
              </span>
            </div>
            <div>
              <span
                onClick={() => {
                  setCreateNewDiet(true);
                }}
                className=" cursor-pointer hover:text-button-hover transition-colors duration-300"
              >
                Create a new Diet
              </span>
            </div>
          </div>
          {dietList[currentDiet as number][currentDay].length > 0 &&
            dietList[currentDiet as number][currentDay].map((elem, idx) => (
              <table
                key={elem.mealName + idx}
                className="w-full table-fixed  text-center text-text-main text-xl border-2 border-border mb-2"
              >
                <tbody>
                  <tr className="border-b-2 border-border bg-bg-secondary">
                    <td
                      onContextMenu={(e) => {
                        ContextMenuHandler(e, idx);
                      }}
                      className=" truncate text-2xl hover:bg-button-hover transition-colors duration-300"
                      colSpan={2}
                    >
                      {elem.mealName}
                    </td>
                  </tr>
                  <tr>
                    <td className="border-b-2 border-r-2 border-border w-1/2">
                      Food
                    </td>
                    <td className="border-b-2 border-border">Weight</td>
                  </tr>
                  {elem.meal.map((food, idx) => (
                    <tr key={elem.mealName + Object.keys(food[1])[0]}>
                      <td
                        className={`${
                          food.length === idx
                            ? "border-r-2 border-border"
                            : "border-b-2 border-r-2 border-border"
                        } truncate`}
                      >
                        {Object.keys(food[1])[0]}
                      </td>
                      <td
                        className={`${
                          food.length === idx
                            ? ""
                            : "border-b-2 border-r-2 border-border"
                        } truncate`}
                      >
                        {food[0]}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-border">
                    <td colSpan={2}>
                      {"Proteins: " +
                        nutrientsMealSum(elem).proteins.toFixed(1) +
                        "g" +
                        " - " +
                        " Fats: " +
                        nutrientsMealSum(elem).fats.toFixed(1) +
                        "g" +
                        " - " +
                        " Carbs: " +
                        nutrientsMealSum(elem).carbohydrates.toFixed(1) +
                        "g" +
                        " - " +
                        " Kcal: " +
                        nutrientsMealSum(elem).kcal.toFixed(1) +
                        "g"}
                    </td>
                  </tr>
                </tbody>
              </table>
            ))}
          <div className="flex justify-center">
            <button
              onClick={() => {
                setOpenAddMeal(true);
              }}
              className="text-text-main text-2xl border-2 border-border rounded-xl px-4 py-2 cursor-pointer hover:border-button-hover"
            >
              Add Meal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
