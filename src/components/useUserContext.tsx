import { useContext, createContext } from "react";
import type { UserDataType } from "../types";

export const userContext = createContext({
  userData: {} as UserDataType,
  setUserData: (() => {}) as React.Dispatch<React.SetStateAction<UserDataType>>,
  loadingData: true,
  currentDietIdx: 0,
  setCurrentDietIdx: (() => {}) as React.Dispatch<React.SetStateAction<number>>,
  currentPlanIdx: 0,
  setCurrentPlanIdx: (() => {}) as React.Dispatch<React.SetStateAction<number>>,
});

export const useUserContext = () => useContext(userContext);
