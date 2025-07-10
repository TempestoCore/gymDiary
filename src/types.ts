export interface UserDataType {
  planList: PlanType[];
  foodList: FoodType[];
  dietList: DietType[];
}

export interface PlanType {
  planName: string;
  comment: string;
  Monday: ExerciseType[] | [];
  Tuesday: ExerciseType[] | [];
  Wednesday: ExerciseType[] | [];
  Thursday: ExerciseType[] | [];
  Friday: ExerciseType[] | [];
  Saturday: ExerciseType[] | [];
  Sunday: ExerciseType[] | [];
}

export interface ExerciseType {
  exerciseName: string;
  weightRep: [number, number][];
}

export interface WorkoutType {
  date: number[];
  workoutStatistic: ExerciseType[];
}

export interface DietType {
  dietName: string;
  Monday: MealType[] | [];
  Tuesday: MealType[] | [];
  Wednesday: MealType[] | [];
  Thursday: MealType[] | [];
  Friday: MealType[] | [];
  Saturday: MealType[] | [];
  Sunday: MealType[] | [];
}

export interface FoodNutrition {
  proteins: number;
  fats: number;
  carbohydrates: number;
  kcal: number;
}

export interface FoodType {
  [name: string]: FoodNutrition;
}

export interface MealType {
  meal: [number, FoodType][];
  mealName: string;
  comment: string;
}
