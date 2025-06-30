import { useEffect, useState } from "react";
import { userContext } from "./useUserContext";
import type { PlanType, UserDataType } from "../types";
import {
  getUserPlans,
  getWorkoutData,
  getUserDietData,
} from "../supabase-client";
export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState({} as UserDataType);
  const [loadingData, setLoadingData] = useState(true);
  const [currentDietIdx, setCurrentDietIdx] = useState(0);
  const [currentPlanIdx, setCurrentPlanIdx] = useState(0);
  useEffect(() => {
    const loadPlans = async () => {
      const userPlansData = await getUserPlans();
      if (userPlansData && userPlansData[0]?.plans) {
        try {
          const plans: PlanType[] = JSON.parse(userPlansData[0].plans);
          setUserData((prev) => ({ ...prev, planList: plans }));
          setCurrentPlanIdx(userPlansData[0].currentPlan);
        } catch (error) {
          console.error("Error parsing plans:", error);
        }
      }
    };

    const checkWorkoutIsCompleted = async (date: number) => {
      const workoutData = await getWorkoutData(date);

      if (workoutData.length > 0) {
        setUserData((prev) => ({
          ...prev,
          workoutStatus: workoutData[0].workoutStatus,
        }));
      } else {
        setUserData((prev) => ({
          ...prev,
          workoutStatus: false,
        }));
      }
    };

    const setUserDietData = async () => {
      const userDietData = await getUserDietData();
      if (userDietData && userDietData.length > 0) {
        const foodList =
          userDietData[0].foodList != null
            ? JSON.parse(userDietData[0].foodList)
            : [];
        const dietList =
          userDietData[0].dietList != null
            ? JSON.parse(userDietData[0].dietList)
            : [];
        setUserData((prev) => {
          return { ...prev, foodList: foodList, dietList: dietList };
        });
        setCurrentDietIdx(userDietData[0].currentDiet);
        return;
      }
      setUserData((prev) => {
        return { ...prev, foodList: [], dietList: [] };
      });
      return;
    };

    Promise.all([
      loadPlans(),
      checkWorkoutIsCompleted(new Date().getTime()),
      setUserDietData(),
    ]).then(() => setLoadingData(false));
  }, []);
  return (
    <userContext.Provider
      value={{
        userData,
        setUserData,
        loadingData,
        currentDietIdx,
        currentPlanIdx,
        setCurrentDietIdx,
        setCurrentPlanIdx,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
