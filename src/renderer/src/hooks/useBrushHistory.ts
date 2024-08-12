import { TOOLS, TOOL_ICONS } from "@renderer/constants"
import { useKritaState } from "@renderer/hooks/useKritaState"
import useLocalStorage from "@renderer/hooks/useLocalStorage"
import { useCallback, useEffect, useMemo, useState } from "react"

function useBrushHistory(size=18): string[] {
  const [{brushPreset},] = useKritaState()
  const [brushHistoryStr, setBrushHistoryStr] = useLocalStorage('BRUSH_HISTORY')

  const brushHistory = useMemo<string[]>(() => {
    if (brushHistoryStr.length === 0) {
      return []
    }
    return JSON.parse(brushHistoryStr)
  }, [brushHistoryStr])

  const appendBrushHistory = useCallback(() => {
    if (brushHistory.length === 0) {
      brushHistory.push(brushPreset)
    } else {
      if (brushHistory.slice(0, size).some(x => x === brushPreset)) {
        return
      }
      brushHistory.unshift(brushPreset)
    }
    setBrushHistoryStr(JSON.stringify(brushHistory.slice(0, 100)))
  }, [brushHistory, setBrushHistoryStr, brushPreset, size])

  useEffect(() => {
    appendBrushHistory()
  }, [appendBrushHistory])

  const slicedBrushHistory = useMemo(() => {
    return brushHistory.slice(0, size)
  }, [size, brushHistory])

  return slicedBrushHistory
}

export default useBrushHistory