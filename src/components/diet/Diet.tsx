import { CreateDiet } from "./CreateDiet";
import { useEffect, useState } from "react";
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

const daysOfWeekLong = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface PropsType {
  sidebarIsOpen: boolean;
}

export function Diet({ sidebarIsOpen }: PropsType) {
  const { userData, currentDietIdx } = useUserContext();
  const [dietList, setDietList] = useState<DietType[] | []>(userData.dietList);
  const [currentDiet, setCurrentDiet] = useState<number | undefined>(
    currentDietIdx,
  );
  const [createNewDiet, setCreateNewDiet] = useState(false);
  const [selectDiet, setSelectDiet] = useState(false);
  const [currentDay, setCurrentDay] = useState(
    daysOfWeek[new Date().getDay()] as WeekdayKeys,
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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
    idx: number,
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

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative flex h-[calc(100%-60px)] overflow-auto">
      {menu.visible && (
        <ContextMenu
          x={sidebarIsOpen ? menu.x - 200 : menu.x}
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
          sidebarIsOpen={sidebarIsOpen}
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
          setDietList={setDietList}
        />
      ) : (
        <div className="relative flex w-full grow flex-col">
          <div className="border-border text-text-main flex h-14 justify-around border-b-2 text-xl">
            {(windowWidth > 800 ? daysOfWeekLong : dayOfWeekShort).map(
              (elem, idx) => (
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
              ),
            )}
          </div>
          <div className="text-text-main flex justify-between px-4 text-xl">
            <div className="flex flex-col">
              <span
                onClick={() => {
                  setSelectDiet(true);
                }}
                className="hover:text-button-hover cursor-pointer transition-colors duration-300"
              >
                Select Diet
              </span>
              <span className="text-text-secondary flex justify-center text-xl">
                {dietList.length > 0 &&
                  dietList[currentDiet as number].dietName}
              </span>
            </div>
            <div>
              <span
                onClick={() => {
                  setCreateNewDiet(true);
                }}
                className="hover:text-button-hover cursor-pointer transition-colors duration-300"
              >
                Create a new Diet
              </span>
            </div>
          </div>
          <div className="mx-1 flex flex-col items-center md:mx-40">
            {dietList[currentDiet as number][currentDay].length > 0 &&
              dietList[currentDiet as number][currentDay].map((elem, idx) => (
                <table
                  key={elem.mealName + idx}
                  className={`text-text-main border-border mb-2 w-full table-fixed border-2 text-center text-xl`}
                >
                  <tbody>
                    <tr className="border-border bg-bg-secondary border-b-2">
                      <td
                        onContextMenu={(e) => {
                          ContextMenuHandler(e, idx);
                        }}
                        className="hover:bg-button-hover truncate text-2xl transition-colors duration-300"
                        colSpan={2}
                      >
                        {elem.mealName}
                      </td>
                    </tr>
                    <tr>
                      <td className="border-border w-1/2 border-r-2 border-b-2">
                        Food
                      </td>
                      <td className="border-border border-b-2">Weight</td>
                    </tr>
                    {elem.meal.map((food, idx) => (
                      <tr key={elem.mealName + Object.keys(food[1])[0]}>
                        <td
                          className={`${
                            food.length === idx
                              ? "border-border border-r-2"
                              : "border-border border-r-2 border-b-2"
                          } truncate`}
                        >
                          {Object.keys(food[1])[0]}
                        </td>
                        <td
                          className={`${
                            food.length === idx
                              ? ""
                              : "border-border border-b-2"
                          } truncate`}
                        >
                          {food[0]}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-border border-t-2">
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
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => {
                setOpenAddMeal(true);
              }}
              className="border-border text-text-main bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease cursor-pointer rounded-xl border-2 px-4 py-2 text-2xl transition-colors duration-300 active:scale-96"
            >
              Add Meal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
