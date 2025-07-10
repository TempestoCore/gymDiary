import { useUserContext } from "../useUserContext";
import type { DietType } from "../../types";
import { TransitionAnimation } from "../animation/TransitionAnimation";
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
      <div className="flex w-full px-2">
        <div className="text-text-main border-border w-full rounded-xl border-2 text-center text-xl">
          Proteins - {sum.prot}. Carbs - {sum.carbs}. Fats - {sum.fats}. - Kcal
          - {sum.kcal}.
        </div>
      </div>
    );
  };

  return (
    <>
      {loadingData ? (
        <TransitionAnimation />
      ) : !isUserSignIn ? (
        <div className="text-text-main mx-10 flex grow items-center justify-center text-2xl">
          To be able save data and see history of your workouts between
          sessions, please sign In.
        </div>
      ) : (
        <div className="flex grow flex-col justify-center gap-1">
          {userData.planList && (
            <div className="border-border flex flex-col items-center gap-2 border-b-2 pt-2 pb-6">
              <div className="text-text-main text-2xl">
                {"Current workout plan: " +
                  userData.planList[currentPlanIdx].planName}
              </div>
              {userData.planList[currentPlanIdx][currentDay].length == 0 ? (
                <div>For today there are no workout</div>
              ) : (
                <div className="flex flex-col">
                  <div className="columns-2">
                    {userData.planList[currentPlanIdx][currentDay].map(
                      (elem, idx) => (
                        <div
                          className="text-text-main text-xl"
                          key={elem.exerciseName + idx}
                        >
                          {elem.exerciseName}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {userData.dietList[currentDietIdx] && (
            <div className="flex w-full grow flex-col items-center gap-2 pt-2">
              <div className="text-text-main text-2xl">
                {"Current diet: " + userData.dietList[currentDietIdx].dietName}
              </div>
              <div className="w-full columns-2 gap-2 px-2">
                {userData.dietList[currentDietIdx][currentDay].map(
                  (elem, idx) => (
                    <div
                      className="text-text-main border-border mb-2 break-inside-avoid rounded-xl border-2 text-center text-xl"
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
                  ),
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
