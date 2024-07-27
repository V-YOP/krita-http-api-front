import { State, useKritaApi } from "@renderer/hooks/useKritaHttpApi";
import { StateCtx, DEFAULT_STATE } from "@renderer/KritaProvider";
import { useContext, useState, useEffect } from "react";


export function useKritaState(): [state: State, setState: (state: Partial<State>) => void, lastState: State] {
  const state = useContext(StateCtx);
  const setState = useKritaApi('state/set');

  const [lastState, setLastState] = useState(DEFAULT_STATE);
  useEffect(() => {
    return () => {
      console.log('setLastState To ', state);
      setLastState(state);
    };
  }, [state]);

  return [state, setState, lastState];
}
