import { State, useKritaApi } from "@renderer/hooks/useKritaHttpApi"
import { generateUUID, sleep } from "@renderer/util"
import React, { useCallback, useEffect, useRef } from "react"
import { useState } from "react"



export const DEFAULT_STATE: State = {
  tool: '', eraserMode: false, canvasOnly: false, brushPreset: '', theme: '',
}

export const StateCtx = React.createContext<State>(DEFAULT_STATE)

type KritaActionCtxValue = [connect: (actionObjectName: string, cb: () => Promise<void>) => string, disconnect: (actionObjectName: string, id: string) => void]

export const LatestActionCtx = React.createContext<KritaActionCtxValue>([() => '', () => {}])

export function KritaProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(DEFAULT_STATE)
  const getState = useKritaApi('state/get')
  useEffect(() => {
    let stopMe = false
    console.log('register fetch state')
    ;((async () => {
      while (true) {
        if (stopMe) {
          return
        }
        await sleep(60)
        const newState = await getState('')
        if (!newState.ok) {
          continue
        }
        setState(newState.data)
      }
    })())

    return () => {
      stopMe = true
    }
  }, [getState])


  const getAction = useKritaApi('action/listen')

  // actionObjectName -> (uuid -> cb)
  const actionCallbacks = useRef({} as Record<string, Record<string, () => Promise<void>>>)

  const connect = useCallback((actionObjectName: string, cb: () => Promise<void>) => {
    actionCallbacks.current[actionObjectName] ??= {}
    const id = generateUUID()
    actionCallbacks.current[actionObjectName][id] = cb
    return id
  }, [])
  const disconnect = useCallback((actionObjectName: string, id: string) => {
    if (actionCallbacks.current[actionObjectName] && actionCallbacks.current[actionObjectName][id]) {
      delete actionCallbacks.current[actionObjectName][id]
    }
  }, [])

  useEffect(() => {
    console.log('register getAction')
    let stopMe = false

    ;((async () => {
      while (true) {
        if (stopMe) {
          return
        }
        await sleep(33)
        const res = await getAction('')
        console.log(res)
        if (!res.ok || res.data.length === 0) {
          continue
        }
        for (const action of actionModify(res.data)) {
          const cbs = actionCallbacks.current[action] ?? {}
          for (const cb of Object.values(cbs)) {
            await cb()
          }
        }

      }
    })())

    return () => {
      stopMe = true
    }
  }, [getAction])

  return (
  <LatestActionCtx.Provider value={[connect, disconnect]}>
    <StateCtx.Provider value={state}>
        {children}
    </StateCtx.Provider>
  </LatestActionCtx.Provider>)
}

// TODO 十笔刷插件会触发brush action……它自己倒是最后一个，这是一个adhoc的修复
function actionModify(actions: string[]): string[] {
  if (actions.length === 0) return []
  return [actions[actions.length - 1]]
}