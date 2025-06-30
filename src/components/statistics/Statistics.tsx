import React, { useState, useEffect } from "react";
import LineChart from "./LineChart";
import { getWorkoutStatistics } from "../../supabase-client";
import { useUserContext } from "../useUserContext";
import type { ExerciseType, PlanType } from "../../types";

const getWorkoutVolumeArr = (
  workoutStatistics: { created_at: string; workout: string }[],
  exercise: string
) => {
  const workoutVolumeArr: { date: string; volume: number }[] = [];

  workoutStatistics.forEach((elem) => {
    const workoutVolume = { date: "", volume: 0 };
    workoutVolume.date = elem.created_at.slice(0, 10);
    let volume = 0;

    try {
      const workoutData: ExerciseType[] = JSON.parse(elem.workout);
      workoutData.forEach((workoutElem) => {
        if (workoutElem.exerciseName === exercise) {
          workoutElem.weightRep.forEach((exer) => {
            volume += exer[0] * exer[1];
          });
        }
      });
    } catch (e) {
      console.error("Error parsing workout data:", e);
    }

    workoutVolume.volume = volume;
    if (volume > 0) {
      workoutVolumeArr.push(workoutVolume);
    }
  });

  return workoutVolumeArr.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const getAllPlanExerciseNames = (plan: PlanType) => {
  const namesArr: string[] = [];
  weekDays.forEach((key) => {
    plan[key].forEach((elem) => {
      if (namesArr.includes(elem.exerciseName)) return;
      namesArr.push(elem.exerciseName);
    });
  });
  return namesArr;
};

export function Statistics() {
  const { userData, currentPlanIdx } = useUserContext();
  const [exerciseName, setExercisesName] = useState(
    getAllPlanExerciseNames(userData.planList[currentPlanIdx])[1]
  );
  const [workoutVolumeForShow, setWorkoutVolumeForShow] = useState<
    { x: string; y: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getWorkoutStatistics(
          userData.planList[currentPlanIdx].planName
        );
        if (res) {
          const volumeData = getWorkoutVolumeArr(res, exerciseName).map(
            (item) => ({
              x: item.date,
              y: item.volume,
            })
          );
          setWorkoutVolumeForShow(volumeData);
        }
      } catch (error) {
        console.error("Error fetching workout statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData, currentPlanIdx, exerciseName]);

  const chartData = {
    datasets: [
      {
        label: "Workout volume",
        data: workoutVolumeForShow,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Workout volume per exercise: ${exerciseName}`,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${value} кг`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month",
          displayFormats: {
            month: "MMM yyyy",
          },
          tooltipFormat: "dd.MM.yyyy",
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Volume",
        },
        min: 0,
      },
    },
  };

  if (loading) {
    return <div>Загрузка данных...</div>;
  }

  if (workoutVolumeForShow.length === 0) {
    return <div>Нет данных для отображения</div>;
  }

  return (
    <div className="w-full h-1/2">
      <div>
        <select
          onChange={(e) => {
            setExercisesName(e.target.value);
          }}
          name=""
          id=""
        >
          {getAllPlanExerciseNames(userData.planList[currentPlanIdx]).map(
            (elem, idx) => (
              <option key={elem + idx}>{elem}</option>
            )
          )}
        </select>
      </div>
      <LineChart data={chartData} options={options} />
    </div>
  );
}
