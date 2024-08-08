import { sleep } from "@renderer/util";
import { useEffect, useState } from "react";

export default function useTodayDrawSeconds(): number {
  const [todaySecond, setTodaySecond] = useState(0)
  useEffect(() => {
    let stop = false;
    ((async () => {
      while (true) {
        if (stop) {
          return
        }
        setTodaySecond(await window.api.getTodayDrawSeconds())
        await sleep(60000)
      }
    })());
    return () => {
      stop = true
    }
  }, [])
  return todaySecond
}