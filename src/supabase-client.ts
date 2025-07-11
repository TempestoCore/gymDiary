import { createClient } from "@supabase/supabase-js";
import type { PlanType } from "./types";
export const supabase = createClient(
  import.meta.env.VITE_API_ADDRESS,
  import.meta.env.VITE_API_KEY,
);

export const updateUserPlans = async (plans: PlanType[]) => {
  const plansJSON = JSON.stringify(plans);
  const userData = await getUser();
  if (!userData) return;
  const { error: updateError } = await supabase
    .from("user_plans")
    .update({ plans: plansJSON })
    .eq("user_id", userData.user.id);

  if (updateError) {
    console.log("Update user plans error " + updateError.message);
  }
};

export const createWorkoutData = async (
  planName: string,
  workoutDate: number,
) => {
  const user = await getUser();
  const { error: insertError } = await supabase.from("workoutData").insert([
    {
      user_id: user?.user.id,
      workoutPlan: planName,
      workoutDate: workoutDate,
    },
  ]);
  if (insertError) {
    console.log("Insert workout data error: " + insertError.message);
  }
};

export const getWorkoutData = async (date: number[], plan: string) => {
  const user = await getUser();
  const { data, error } = await supabase
    .from("workoutData")
    .select("*")
    .not("workout", "is", null)
    .eq("user_id", user?.user.id)
    .eq("workoutPlan", plan)
    .gte("workoutDate", date[0])
    .lte("workoutDate", date[1]);
  if (error) {
    return error.message;
  }
  return data;
};

export const updateWorkoutData = async (workoutDate: number, data: string) => {
  const user = await getUser();
  const { error } = await supabase
    .from("workoutData")
    .update({ workout: JSON.stringify(data) })
    .eq("user_id", user?.user.id)
    .eq("workoutDate", workoutDate);
  if (error) {
    console.error(error.message);
  }
};

export const deleteWorkoutData = async (workoutDate: number) => {
  const user = await getUser();
  const { error } = await supabase
    .from("workoutData")
    .delete()
    .eq("workoutDate", workoutDate)
    .eq("user_id", user?.user.id);
  if (error) {
    console.error(error.message);
  }
};

export const getUserPlans = async () => {
  const user = await getUser();
  const { data: userPlans, error: getError } = await supabase
    .from("user_plans")
    .select("*")
    .eq("user_id", user?.user.id);
  if (getError) {
    console.log("User getting plans error " + getError.message);
    return;
  }

  return userPlans;
};

export const getUserDietData = async () => {
  const user = await getUser();
  const { data: userDiets, error: getError } = await supabase
    .from("userDietData")
    .select("*")
    .eq("user_id", user?.user.id);
  if (getError) {
    console.log("User getting diet data " + getError.message);
    return;
  }

  return userDiets;
};

export const createUserDietData = async () => {
  const { error: insertError } = await supabase
    .from("userDietData")
    .insert([{ foodList: null, dietList: null }]);
  if (insertError) {
    console.log("Insert diet data error: " + insertError.message);
  }
};

export const updateUserDietList = async (dietList: string) => {
  const user = await getUser();
  const { error: updateError } = await supabase
    .from("userDietData")
    .update([{ dietList: dietList }])
    .eq("user_id", user?.user.id);
  if (updateError) {
    console.log("Update user diet list error: " + updateError.message);
  }
};

export const updateUserFoodList = async (foodList: string) => {
  const user = await getUser();
  const { error: updateError } = await supabase
    .from("userDietData")
    .update([{ foodList: foodList }])
    .eq("user_id", user?.user.id);
  if (updateError) {
    console.log("Update user food list error: " + updateError.message);
  }
};

export const updateCurrentDiet = async (idx: number) => {
  const user = await getUser();
  const { error: updateError } = await supabase
    .from("userDietData")
    .update([{ currentDiet: idx }])
    .eq("user_id", user?.user.id);
  if (updateError) {
    console.log("Update current diet error " + updateError.message);
  }
};
export const updateCurrentPlan = async (idx: number) => {
  const user = await getUser();
  const { error: updateError } = await supabase
    .from("user_plans")
    .update([{ currentPlan: idx }])
    .eq("user_id", user?.user.id);
  if (updateError) {
    console.log("Update current plan error " + updateError.message);
  }
};

export const getWorkoutStatistics = async (workoutPlan: string) => {
  const user = await getUser();
  const { data, error } = await supabase
    .from("workoutData")
    .select("created_at, workout")
    .eq("user_id", user?.user.id)
    .eq("workoutPlan", workoutPlan);
  if (error) {
    console.log("Get workout statistics error: " + error.message);
  }
  return data;
};

export const getUser = async () => {
  const { data, error: getUserError } = await supabase.auth.getUser();
  if (getUserError) {
    console.log("Get user error: " + getUserError.message);
    return;
  }
  return data;
};
