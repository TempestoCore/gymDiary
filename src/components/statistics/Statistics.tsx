import { useState, useEffect } from "react";
import { useUserContext } from "../useUserContext";
import { getWorkoutData } from "../../supabase-client";
import type { ExerciseType } from "../../types";
import { TransitionAnimation } from "../animation/TransitionAnimation";
interface loadedDataType {
  workoutDate: number;
  workout: ExerciseType[];
}
export function Statistics() {
  const { userData, currentPlanIdx } = useUserContext();
  const [period, setPeriod] = useState([0, 0]);
  const [planName, setPlanName] = useState(
    userData.planList[currentPlanIdx].planName,
  );
  const [loading, setLoading] = useState(false);
  const [loadedData, setLoadedData] = useState<loadedDataType[] | []>([]);
  const getDateString = (date: number) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    return `${day < 10 ? `0${day}` : day}.${month < 10 ? `0${month}` : month}.${year}`;
  };

  const saveHandler = () => {
    const data = loadedData;
    const jsonStr = JSON.stringify(data);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${planName}${getDateString(period[0])}-${getDateString(period[1])}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!loading) return;
    getWorkoutData(period, planName).then((res) => {
      if (typeof res === "object") {
        console.log(res);

        setLoadedData(() => {
          const arrValue: loadedDataType[] = [];
          res.forEach((elem) => {
            const value: loadedDataType = {
              workout: JSON.parse(JSON.parse(elem.workout)),
              workoutDate: elem.workoutDate,
            };
            arrValue.push(value);
          });
          console.log(arrValue);
          return arrValue;
        });
      }
      setLoading(false);
    });
  }, [loading, period, planName]);

  return (
    <div className="text-text-main flex h-[calc(100%-60px)] w-full flex-col items-center gap-6 overflow-x-hidden overflow-y-auto text-2xl">
      <div>
        <span>Get workout in time period</span>
      </div>
      <div>
        <span>Plan: </span>
        <select
          defaultValue={planName}
          onChange={(e) => {
            setPlanName(e.target.value);
          }}
          className="outline-0"
        >
          {userData.planList.map((elem, idx) => (
            <option key={elem.planName + idx}>{elem.planName}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-4 text-xl md:flex-row">
        <label htmlFor="from">From:</label>
        <input
          className="bg-bg-secondary outline-0"
          id="from"
          onChange={(e) => {
            setPeriod((prev) => {
              const newPeriod = [...prev];
              newPeriod[0] = new Date(e.target.value).getTime();
              return newPeriod;
            });
          }}
          type="date"
        />
        <label htmlFor="To">To:</label>
        <input
          className="bg-bg-secondary outline-0"
          id="To"
          onChange={(e) => {
            setPeriod((prev) => {
              const newPeriod = [...prev];
              newPeriod[1] = new Date(e.target.value).getTime();
              return newPeriod;
            });
          }}
          type="date"
        />
      </div>
      <div className="flex w-full items-center justify-center gap-10">
        <button
          onClick={() => {
            setLoading(true);
          }}
          className="border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease text-text-main cursor-pointer rounded-xl border-2 px-4 py-2 text-2xl transition-colors duration-300 active:scale-96"
        >
          Get
        </button>
        <button
          onClick={saveHandler}
          className={`border-border bg-bg-secondary active:border-button hover:border-button active:bg-button-hover ease text-text-main cursor-pointer rounded-xl border-2 px-4 py-2 text-2xl transition-colors duration-300 active:scale-96 ${loadedData.length === 0 && "pointer-events-none opacity-50"}`}
        >
          Save as JSON
        </button>
      </div>
      <div className="flex w-full grow flex-col items-center gap-2 pb-4">
        {loading ? (
          <TransitionAnimation />
        ) : loadedData.length === 0 ? (
          <div>No data to show</div>
        ) : (
          <>
            {loadedData.map((elem) => (
              <div
                className="border-border flex w-9/10 flex-col items-center border-2 border-b-0 md:w-3/5"
                key={elem.workoutDate}
              >
                <span className="border-border bg-button-hover w-full border-b-2 text-center">
                  {getDateString(elem.workoutDate)}
                </span>
                {elem.workout.map((exercise, exerIdx) => (
                  <div
                    className="flex w-full flex-col items-center"
                    key={exercise.exerciseName + exerIdx}
                  >
                    <div className="border-border bg-bg-secondary w-full border-b-2 text-center">
                      {exercise.exerciseName}
                    </div>
                    <div className="border-border flex w-full border-b-2">
                      <span className="border-border w-1/2 border-r-2 text-center">
                        Rep
                      </span>
                      <span className="w-1/2 text-center">Weight</span>
                    </div>
                    {exercise.weightRep.map((set, setIdx) => (
                      <div
                        className={`border-border flex w-full border-b-2`}
                        key={exercise.exerciseName + elem.workoutDate + setIdx}
                      >
                        <span className="border-border w-1/2 border-r-2 text-center">
                          {set[0]}
                        </span>
                        <span className="w-1/2 text-center">{set[1]}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
