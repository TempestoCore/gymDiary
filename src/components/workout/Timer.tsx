import type { ExerciseType, PlanType } from "../../types";
import { useEffect, useState } from "react";

interface PropsType {
  isWorkoutStart: boolean;
  pauseWorkout: boolean;
  currentPlan: PlanType;
  currentWorkout: ExerciseType[];
  isWorkoutComplete: false;
  exerciseNote: {
    currentIdx: number;
    currentSetIdx: number;
  };
}
interface timerBackupType {
  minutes: number;
  seconds: number;
}
const getTimerBackup = (): timerBackupType => {
  const timerBackupJson = localStorage.getItem("currentTimerBackup");
  const value: timerBackupType = {
    minutes: 0,
    seconds: 0,
  };
  if (timerBackupJson) {
    const timerBackup = JSON.parse(timerBackupJson);
    value.minutes = timerBackup.minutes;
    value.seconds = timerBackup.seconds;
  }
  return value;
};

export function Timer({
  isWorkoutStart,
  pauseWorkout,
  currentPlan,
  currentWorkout,
  isWorkoutComplete,
  exerciseNote,
}: PropsType) {
  const [minutes, setMinutes] = useState(getTimerBackup().minutes);
  const [seconds, setSeconds] = useState(getTimerBackup().seconds);
  const correctTimerNumber = (time: number, min?: boolean) => {
    if (time === 60 && !min) {
      return "00";
    }
    if (time === 99 && min) {
      return "00";
    }
    if (time < 10) {
      return `0${time}`;
    }
    return time;
  };
  useEffect(() => {
    if (!isWorkoutStart) return;
    const timerIntervalHandler = () => {
      if (pauseWorkout) return;
      setSeconds((prev) => {
        if (prev === 59) {
          setMinutes((prev) => prev + 1);
        }
        return prev === 59 ? 0 : prev + 1;
      });
    };
    const intervalId = setInterval(timerIntervalHandler, 1000);
    return () => {
      return clearInterval(intervalId);
    };
  }, [isWorkoutStart, pauseWorkout]);
  useEffect(() => {
    if (!isWorkoutStart && !isWorkoutComplete) return;
    const backup = {
      isWorkoutStart: isWorkoutStart,
      currentPlan: currentPlan,
      currentWorkout: currentWorkout,
      isWorkoutComplete: isWorkoutComplete,
      exerciseNote: exerciseNote,
    };

    localStorage.setItem("currentWorkoutBackup", JSON.stringify(backup));
  }, [
    seconds,
    minutes,
    isWorkoutStart,
    currentPlan,
    currentWorkout,
    isWorkoutComplete,
    exerciseNote,
  ]);

  useEffect(() => {
    if (!isWorkoutStart && !isWorkoutComplete) return;
    const timerBackup = {
      seconds: seconds,
      minutes: minutes,
    };
    localStorage.setItem("currentTimerBackup", JSON.stringify(timerBackup));
  }, [seconds, minutes, isWorkoutStart, isWorkoutComplete]);

  useEffect(() => {}, []);
  return (
    <div className="text-text-main flex grow items-center justify-center text-9xl md:text-[25dvh]">
      <span>{correctTimerNumber(minutes, true)}</span>
      <span className="pb-10">:</span>
      <span>{correctTimerNumber(seconds)}</span>
    </div>
  );
}
