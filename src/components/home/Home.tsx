import { useUserContext } from "../useUserContext";
import type { DietType } from "../../types";

interface PropsType {
  isUserSignIn: boolean;
}

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

const currentDay = daysOfWeek[new Date().getDay()] as WeekdayKeys;

export function Home({ isUserSignIn }: PropsType) {
  const { loadingData, userData, currentDietIdx, currentPlanIdx } =
    useUserContext();

  const calNutritionSum = (diet: DietType) => {
    const sum = {
      prot: 0,
      carbs: 0,
      fats: 0,
      kcal: 0,
    };
    diet[currentDay].forEach((elem) => {
      elem.meal.forEach((food) => {
        sum.carbs += food[1][Object.keys(food[1])[0]].carbohydrates;
        sum.prot += food[1][Object.keys(food[1])[0]].proteins;
        sum.fats += food[1][Object.keys(food[1])[0]].fats;
        sum.kcal += food[1][Object.keys(food[1])[0]].kcal;
      });
    });

    return (
      <div className="w-full flex px-2">
        <div className="w-full text-xl text-text-main text-center border-2 border-border rounded-xl">
          Proteins - {sum.prot}. Carbs - {sum.carbs}. Fats - {sum.fats}. - Kcal
          - {sum.kcal}.
        </div>
      </div>
    );
  };

  return (
    <>
      {loadingData ? (
        <div className="flex flex-col justify-center grow gap-1">
          <div className="flex flex-col items-center justify-center grow gap-1 border-b-2 border-border">
            <div className="h-6 w-1/2 bg-button-hover animate-pulse rounded-2xl"></div>
            <div className="h-6 w-1/2 bg-button-hover animate-pulse rounded-2xl"></div>
            <div className="h-6 w-1/2 bg-button-hover animate-pulse rounded-2xl"></div>
            <div className="h-6 w-1/2 bg-button-hover animate-pulse rounded-2xl"></div>
          </div>
          <div className="flex flex-col items-center justify-center grow gap-1">
            <div className="h-6 w-1/2 bg-button-hover animate-pulse rounded-2xl"></div>
            <div className="h-6 w-1/2 bg-button-hover animate-pulse rounded-2xl"></div>
            <div className="h-6 w-1/2 bg-button-hover animate-pulse rounded-2xl"></div>
            <div className="h-6 w-1/2 bg-button-hover animate-pulse rounded-2xl"></div>
          </div>
        </div>
      ) : !isUserSignIn ? (
        <div className="flex grow mx-10 items-center justify-center text-2xl text-text-main">
          To start using this web application, please sign up and/or sing in.
        </div>
      ) : (
        <div className="flex flex-col justify-center grow gap-1">
          {userData.planList && (
            <div className="flex flex-col items-center gap-2 pt-2 pb-6 border-b-2 border-border">
              <div className="text-2xl text-text-main">
                {"Current workout plan: " +
                  userData.planList[currentPlanIdx].planName}
              </div>
              {userData.planList[currentPlanIdx][currentDay].length == 0 ? (
                <div>For today there are no workout</div>
              ) : (
                <div className="flex flex-col">
                  <div className="text-xl text-text-secondary">
                    {userData.workoutStatus
                      ? "Today workout is complete"
                      : "Today workout is not complete"}
                  </div>
                  <div className="columns-2">
                    {userData.planList[currentPlanIdx][currentDay].map(
                      (elem, idx) => (
                        <div
                          className="text-text-main text-xl"
                          key={elem.exerciseName + idx}
                        >
                          {elem.exerciseName}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {userData.dietList[currentDietIdx] && (
            <div className="flex flex-col w-full items-center grow gap-2 pt-2">
              <div className="text-2xl text-text-main">
                {"Current diet: " + userData.dietList[currentDietIdx].dietName}
              </div>
              <div className="columns-2 gap-2 w-full px-2">
                {userData.dietList[currentDietIdx][currentDay].map(
                  (elem, idx) => (
                    <div
                      className="text-text-main text-xl rounded-xl text-center border-2 border-border mb-2 break-inside-avoid"
                      key={elem.mealName + idx}
                    >
                      {elem.mealName}
                      {elem.meal.map((food, idx) => (
                        <div
                          className="text-text-secondary text-xl"
                          key={Object.keys(food[1])[0] + idx}
                        >
                          {Object.keys(food[1])[0] + ": " + food[0] + "g"}
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
              {calNutritionSum(userData.dietList[currentDietIdx])}
            </div>
          )}
        </div>
      )}
    </>
  );
}
