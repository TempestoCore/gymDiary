import { useEffect, useState } from "react";

interface PropsType {
  startTimer: boolean;
  isWorkOutDone: boolean;
}

function useSavedState(
  key: string,
  initialValue: [number, number]
): [[number, number], React.Dispatch<React.SetStateAction<[number, number]>>] {
  const [state, setState] = useState(() => {
    try {
      const saved = sessionStorage.getItem(key);
      if (!saved) {
        sessionStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
      return JSON.parse(saved);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  return [state, setState];
}

const timerShowValue = (min: number, sec: number) => {
  const minutes: string = `${min < 10 ? "0" + min : min}`;
  const seconds: string = `${sec < 10 ? "0" + sec : sec}`;
  const timeStr: string = `${minutes} : ${seconds}`;
  return timeStr;
};

export function Timer({ startTimer, isWorkOutDone }: PropsType) {
  const [timerValue, setTimerValue] = useSavedState("gymTimerValue", [0, 0]);

  useEffect(() => {
    if (isWorkOutDone) {
      setTimerValue([0, 0]);
      return;
    }
    if (!startTimer) return;
    const timerID = setInterval(() => {
      setTimerValue((prev) => {
        if (prev[1] == 59) {
          return [prev[0] + 1, 0];
        }
        return [prev[0], prev[1] + 1];
      });
    }, 1000);
    return () => clearInterval(timerID);
  }, [startTimer, setTimerValue, isWorkOutDone]);
  return (
    <div className="flex select-none justify-center items-center grow text-9xl">
      <div>{timerShowValue(timerValue[0], timerValue[1])}</div>
    </div>
  );
}
