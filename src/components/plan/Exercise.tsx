import type { ExerciseType, PlanType } from "../../types";
import { useEffect, useState } from "react";
interface PropsType {
  elem: ExerciseType;
  edit: boolean;
  setPlanList: React.Dispatch<React.SetStateAction<PlanType[]>>;
  currentPlan: number;
  idx: number;
  currentDay:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
}
export function Exercise({
  elem,
  edit,
  setPlanList,
  currentPlan,
  currentDay,
  idx,
}: PropsType) {
  const [showData, setShowData] = useState(false);
  useEffect(() => {
    if (!edit) return;
    setShowData(true);
  }, [edit]);
  const changeSetValueHandler = (
    value: string | number,
    set: number,
    setType: "rep" | "weight"
  ) => {
    value = Number(value);
    if (setType === "rep") {
      setPlanList((prev) => {
        const newPlan = [...prev];
        newPlan[currentPlan][currentDay][idx].weightRep[set][0] = value;
        return newPlan;
      });
    }
    if (setType === "weight") {
      setPlanList((prev) => {
        const newPlan = [...prev];
        newPlan[currentPlan][currentDay][idx].weightRep[set][1] = value;
        return newPlan;
      });
    }
  };

  const changeExerciseNameHandler = (value: string) => {
    setPlanList((prev) => {
      const newPlan = [...prev];
      newPlan[currentPlan][currentDay][idx].exerciseName = value;
      return newPlan;
    });
  };

  const addNewSetHandler = (Exercise: number) => {
    setPlanList((prev) => {
      const newArr = [...prev];
      newArr[currentPlan][currentDay][Exercise].weightRep.push([0, 0]);
      return newArr;
    });
  };

  const deleteSetHandler = (set: number) => {
    setPlanList((prev) => {
      const newArr = [...prev];
      const newWeightRep = newArr[currentPlan][currentDay][
        idx
      ].weightRep.filter((_, index) => index !== set);
      newArr[currentPlan][currentDay][idx].weightRep = newWeightRep;
      return newArr;
    });
  };

  const deleteAllSetsHandler = () => {
    setPlanList((prev) => {
      const newArr = [...prev];
      newArr[currentPlan][currentDay][idx].weightRep = [];
      return newArr;
    });
  };

  const deleteExercise = () => {
    setPlanList((prev) => {
      console.log(prev);
      const newPlan = [...prev];
      const newExerciseList: ExerciseType[] = newPlan[currentPlan][
        currentDay
      ].filter((_, exerciseIdx) => exerciseIdx !== idx);
      newPlan[currentPlan][currentDay] = newExerciseList;
      console.log(newPlan);
      return newPlan;
    });
  };

  return (
    <div className="w-18/20 md:w-16/20 lg:w-12/20">
      <table
        className={`w-full mt-3 text-text-main text-lg border-border border-t-2 border-x-2 text-center`}
      >
        <tbody>
          <tr>
            <td
              colSpan={3}
              onClick={() => {
                if (edit) return;
                setShowData((prev) => !prev);
              }}
              className={`${
                !edit && "py-2"
              } w-full text-text-main text-2xl font-bold border-b-2  border-border text-center select-none cursor-pointer  ${
                showData ? "bg-button-hover border-b-0" : "bg-bg-secondary "
              } hover:bg-button-hover mt-2 transition-colors duration-300`}
            >
              {edit ? (
                <input
                  className={`${
                    edit ? "" : ""
                  } outline-none mx-auto w-full h-14 text-center pl-4 overflow-hidden inline border-2 border-button`}
                  value={elem.exerciseName}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onChange={(e) => {
                    changeExerciseNameHandler(e.target.value);
                  }}
                  type="text"
                />
              ) : (
                <>{elem.exerciseName}</>
              )}
            </td>
            {edit && (
              <td
                onClick={() => {
                  deleteExercise();
                }}
                className="px-2 border-2 bg-bg-secondary border-border select-none cursor-pointer hover:bg-error text-text-main"
              >
                Delete Exercise
              </td>
            )}
          </tr>

          {showData ? (
            <>
              <tr className="bg-bg-secondary font-bold">
                <td className="border-2 border-l-0 border-border">№</td>
                <td className="border-2 border-border">Rep</td>
                <td className="border-2 border-r-0 border-border">Weight</td>
                {edit && (
                  <td
                    onClick={() => {
                      deleteAllSetsHandler();
                    }}
                    className="px-2 border-2 font-normal bg-bg-secondary border-border select-none cursor-pointer hover:bg-error text-text-main"
                  >
                    Delete All
                  </td>
                )}
              </tr>
              {elem.weightRep.map((sets, set) => (
                <tr className="bg-bg-secondary relative" key={idx + set}>
                  <td className="border-b-2 border-border">
                    <span
                      className={`flex justify-center items-center select-none`}
                    >
                      {elem.weightRep.indexOf(sets) + 1}{" "}
                    </span>
                  </td>
                  <td className="border-2 border-border">
                    <input
                      disabled={!edit}
                      value={sets[0]}
                      type="number"
                      onChange={(e) => {
                        changeSetValueHandler(e.target.value, set, "rep");
                      }}
                      className={`text-text-main text-center w-full `}
                    />
                  </td>
                  <td className="border-2 border-r-0 border-border">
                    <input
                      disabled={!edit}
                      value={sets[1]}
                      type="number"
                      onChange={(e) => {
                        changeSetValueHandler(e.target.value, set, "weight");
                      }}
                      className={`text-text-main text-center w-full `}
                    />
                  </td>
                  {edit && (
                    <td
                      onClick={() => {
                        deleteSetHandler(set);
                      }}
                      className="px-2 border-2 border-border select-none cursor-pointer hover:bg-error text-text-main"
                    >
                      Delete
                    </td>
                  )}
                </tr>
              ))}

              {edit && (
                <tr className="bg-bg-secondary">
                  <td
                    onClick={() => {
                      addNewSetHandler(idx);
                    }}
                    colSpan={edit ? 4 : 3}
                    className="border-b-2 border-border hover:bg-button-hover transition-colors duration-300 cursor-pointer"
                  >
                    Add
                  </td>
                </tr>
              )}
            </>
          ) : (
            <></>
          )}
        </tbody>
      </table>
    </div>
  );
}
