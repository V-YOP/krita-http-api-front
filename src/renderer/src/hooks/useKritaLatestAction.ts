import { LatestActionCtx } from "@renderer/KritaProvider";
import { useContext, useEffect } from "react";


export function useKritaLatestAction(actionObjectName: string, cb: () => Promise<void>, deps: unknown[]): void {
  const [connect, disconnect] = useContext(LatestActionCtx);
  useEffect(() => {
    console.log('connect actions');
    const id = connect(actionObjectName, cb);
    return () => {
      disconnect(actionObjectName, id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect, disconnect, actionObjectName, ...deps]);
}
