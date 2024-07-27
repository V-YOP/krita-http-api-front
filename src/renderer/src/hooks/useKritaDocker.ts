import { useKritaApi } from "@renderer/hooks/useKritaHttpApi"
import { useCallback, useEffect, useMemo, useState } from "react"

function toKritaCoord(x: number, electronZoomFactor: number, kritaScalingFactor: number) {
  return Math.trunc(x * electronZoomFactor / kritaScalingFactor)
}
function fromKritaCoord(x: number, electronZoomFactor: number, kritaScalingFactor: number) {
  return Math.trunc(x / electronZoomFactor * kritaScalingFactor)
}

function useKritaDocker(objectName: string) {
  const setDockerState = useKritaApi('docker/set-state')
  const getDockerStateApi = useKritaApi('docker/get-state')

  const getDockerState = useCallback(async () => {
    const res = await getDockerStateApi(objectName)
    if (!res.ok) return res
    const zoomFactor = await window.api.getZoomFactor()
    res.data.pos = res.data.pos.map(x => fromKritaCoord(x, zoomFactor, 1)) as [number, number];
    res.data.size = res.data.size.map(x => fromKritaCoord(x, zoomFactor, 1)) as [number, number];
    console.log('get docker state')
    return res
  }, [getDockerStateApi, objectName])

  const mySetDockerState = useCallback(async (param: {pos?: [number, number], size?: [number, number], visible?: boolean}) => {
    const zoomFactor = await window.api.getZoomFactor()
    const {pos, size, visible} = param
    console.log('set docker state')
    await setDockerState({
      objectName,
      floating: true,
      withHeader: false,
      // TODO krita 缩放级别
      pos: pos?.map(x => toKritaCoord(x, zoomFactor, 1)) as [number, number], 
      size: size?.map(x => toKritaCoord(x, zoomFactor, 1)) as [number, number], 
      visible
    })
  }, [objectName, setDockerState])

  const setPos = useCallback((pos: [number, number]) => {
    return mySetDockerState({pos})
  }, [mySetDockerState])
  
  const setSize = useCallback((size: [number, number]) => {
    return mySetDockerState({size})
  }, [mySetDockerState])

  const setVisible = useCallback((visible: boolean) => {
    return mySetDockerState({visible})
  }, [mySetDockerState])

  const res = useMemo(() => ({
    setPos, setSize, setVisible, getDockerState
  }), [setPos, setSize, setVisible, getDockerState])
  return res
}

export default useKritaDocker