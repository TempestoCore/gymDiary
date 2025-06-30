import type { FoodType, MealType } from "../../types";
import { useUserContext } from "../useUserContext";
import { useEffect, useState } from "react";
import { ContextMenu } from "./ContextMenu";
import { updateUserFoodList } from "../../supabase-client";
type sortByNutritionType =
  | "proteins"
  | "carbohydrates"
  | "fats"
  | "kcal"
  | undefined;
interface PropsType {
  setOpenModalAddFood: React.Dispatch<React.SetStateAction<boolean>>;
  setAddMeal: React.Dispatch<React.SetStateAction<MealType>>;
  addMeal: MealType;
}
export function FoodList({
  setOpenModalAddFood,
  setAddMeal,
  addMeal,
}: PropsType) {
  const { userData, setUserData } = useUserContext();
  const [sortByNutrition, setSortByNutrition] =
    useState<sortByNutritionType>(undefined);
  const [sortByName, setSortByName] = useState<string>("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [ascSort, setAscSort] = useState(false);
  const [menu, setMenu] = useState({
    x: 0,
    y: 0,
    targetId: 0,
    visible: false,
  });
  const sortFoodList = (
    foodList: FoodType[],
    sortByName: string,
    sortByNutrition: sortByNutritionType
  ) => {
    const sortedFoodList = [...foodList].filter((food) => {
      return Object.keys(food)[0]
        .toLocaleLowerCase()
        .startsWith(sortByName.toLocaleLowerCase());
    });
    if (sortByNutrition) {
      sortedFoodList.sort((a, b) => {
        const foodNameA = Object.keys(a)[0];
        const foodNameB = Object.keys(b)[0];
        const valueA = a[foodNameA][sortByNutrition];
        const valueB = b[foodNameB][sortByNutrition];

        return ascSort
          ? Number(valueA) < Number(valueB)
            ? -1
            : 1
          : Number(valueA) > Number(valueB)
          ? -1
          : 1;
      });
    }

    return sortedFoodList;
  };

  const findRepeatFoodInMeal = (elem: MealType, foodName: string) => {
    for (let i = 0; i <= elem.meal.length - 1; i++) {
      if (Object.keys(elem.meal[i][1])[0] === foodName) return true;
    }
    return false;
  };

  const addFoodToMeal = (elem: FoodType) => {
    if (findRepeatFoodInMeal(addMeal, Object.keys(elem)[0])) return;
    setAddMeal((prev) => {
      const newMeal = { ...prev };
      const mealsArr = newMeal.meal;
      newMeal.meal = [...mealsArr, [100, elem]];
      return newMeal;
    });
  };

  const ContextMenuHandler = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
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

  const deleteFoodFromFoodList = () => {
    setUserData((prev) => {
      const newUserData = { ...prev };
      const newFoodList = [...newUserData.foodList].filter(
        (_, idx) => idx != menu.targetId
      );
      newUserData.foodList = newFoodList;
      updateUserFoodList(JSON.stringify(newFoodList));
      return newUserData;
    });
  };

  const closeMenu = () => {
    setMenu({ ...menu, visible: false });
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-1/2 relative flex flex-col grow">
      {menu.visible && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          onDelete={deleteFoodFromFoodList}
          onClose={closeMenu}
        />
      )}
      <div className="flex justify-center text-2xl text-text-main">
        Food List
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => {
            setOpenModalAddFood((prev) => !prev);
          }}
          className="text-text-main text-xl border-2 border-border px-4 py-2 cursor-pointer hover:border-button-hover rounded-xl"
        >
          Add food
        </button>
      </div>
      <div className="flex flex-wrap justify-around text-text-main text-lg">
        <button>Sort:</button>
        <button
          onClick={() => {
            setSortByNutrition("proteins");
          }}
          className={`${
            sortByNutrition == "proteins" ? "text-button" : "text-text-main"
          } cursor-pointer hover:text-button-hover`}
        >
          Prot
        </button>
        <button
          onClick={() => {
            setSortByNutrition("carbohydrates");
          }}
          className={`${
            sortByNutrition == "carbohydrates"
              ? "text-button"
              : "text-text-main"
          } cursor-pointer hover:text-button-hover`}
        >
          Carbs
        </button>
        <button
          onClick={() => {
            setSortByNutrition("fats");
          }}
          className={`${
            sortByNutrition == "fats" ? "text-button" : "text-text-main"
          } cursor-pointer hover:text-button-hover`}
        >
          Fat
        </button>
        <button
          onClick={() => {
            setSortByNutrition("kcal");
          }}
          className={`${
            sortByNutrition == "kcal" ? "text-button" : "text-text-main"
          } cursor-pointer hover:text-button-hover`}
        >
          Kcal
        </button>
        <button
          onClick={() => {
            setAscSort((prev) => !prev);
          }}
          className={`w-9 text-text-secondary cursor-pointer hover:text-button-hover`}
        >
          {ascSort ? "Asc" : "Desc"}
        </button>
      </div>
      <div className="flex">
        <input
          onChange={(e) => {
            setSortByName(e.target.value);
          }}
          value={sortByName}
          placeholder="Find food..."
          className="bg-bg-secondary w-full text-text-main text-xl px-1 outline-none border-2 border-border"
        />
      </div>
      <div className="border-2 border-t-0 border-border grow h-10 overflow-y-scroll">
        <table className="text-text-main w-full table-fixed ">
          {windowWidth > 1000 ? (
            <tbody>
              <tr className="text-center text-xl">
                <td className="w-3/5 text-center">Name</td>
                <td>Prot</td>
                <td>Fats</td>
                <td>Carbs</td>
                <td>Kcal</td>
              </tr>
              {sortFoodList(userData.foodList, sortByName, sortByNutrition).map(
                (elem, idx) => (
                  <tr
                    onContextMenu={(e) => ContextMenuHandler(e, idx)}
                    onClick={() => {
                      addFoodToMeal(elem);
                    }}
                    className="text-xl cursor-pointer text-center hover:bg-bg-secondary transition-colors duration-100"
                    key={idx}
                  >
                    <td className="text-center truncate">
                      {Object.keys(elem)}
                    </td>
                    <td>{elem[Object.keys(elem)[0]].proteins}</td>
                    <td>{elem[Object.keys(elem)[0]].fats}</td>
                    <td>{elem[Object.keys(elem)[0]].carbohydrates}</td>
                    <td>{elem[Object.keys(elem)[0]].kcal}</td>
                  </tr>
                )
              )}
            </tbody>
          ) : (
            <tbody>
              {sortFoodList(userData.foodList, sortByName, sortByNutrition).map(
                (elem, idx) => (
                  <tr
                    onContextMenu={(e) => ContextMenuHandler(e, idx)}
                    onClick={() => {
                      addFoodToMeal(elem);
                    }}
                    className="cursor-pointer text-center flex flex-col hover:bg-bg-secondary transition-colors duration-100"
                    key={idx}
                  >
                    <td className="text-xl truncate">{Object.keys(elem)}</td>
                    <td
                      className={` ${
                        sortByNutrition === "proteins"
                          ? "text-button"
                          : "text-text-secondary"
                      }`}
                    >
                      {"Prot: " + elem[Object.keys(elem)[0]].proteins}
                    </td>
                    <td
                      className={` ${
                        sortByNutrition === "fats"
                          ? "text-button"
                          : "text-text-secondary"
                      }`}
                    >
                      {"Fats: " + elem[Object.keys(elem)[0]].fats}
                    </td>
                    <td
                      className={` ${
                        sortByNutrition === "carbohydrates"
                          ? "text-button"
                          : "text-text-secondary"
                      }`}
                    >
                      {"Carbs: " + elem[Object.keys(elem)[0]].carbohydrates}
                    </td>
                    <td
                      className={` ${
                        sortByNutrition === "kcal"
                          ? "text-button"
                          : "text-text-secondary"
                      }`}
                    >
                      {"Kcal: " + elem[Object.keys(elem)[0]].kcal}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
