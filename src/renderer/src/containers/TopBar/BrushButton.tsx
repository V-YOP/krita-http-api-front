import { Button, Image } from "@chakra-ui/react";
import { ACTIVE_BG, ICONS, TOOL_ICONS } from "@renderer/constants";
import useKritaDocker from "@renderer/hooks/useKritaDocker";
import { useKritaIcon } from "@renderer/hooks/useKritaIcon";
import { useKritaLatestAction } from "@renderer/hooks/useKritaLatestAction";
import useKritaResourceIcon from "@renderer/hooks/useKritaResourceIcon";
import { useKritaState } from "@renderer/hooks/useKritaState";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type BrushButtonParam = {
  displayDocker: boolean,
  displayDockerChanged: (display: boolean) => void,
}

function BrushButton({ displayDocker, displayDockerChanged }: BrushButtonParam) {
  const [state, setState, lastState] = useKritaState()
  const brushDocker = useKritaDocker('PresetDocker')


  const eraserIcon = useKritaIcon(ICONS['ERASER_MODE'])
  const brushIcon = useKritaIcon(TOOL_ICONS['KritaShape/KisToolBrush'])
  const brushResourceIcon = useKritaResourceIcon('preset', state.brushPreset)
  const brushEnabled = useMemo(() => {
    return state.tool === 'KritaShape/KisToolBrush'
  }, [state.tool])

  const buttonRef = useRef(null as unknown as HTMLButtonElement)

  useEffect(() => {
    if (!displayDocker) {
      // hide me
      brushDocker.setVisible(false)
      return
    }
    const btn = buttonRef.current
    const { bottom, left } = btn.getBoundingClientRect();
    brushDocker.getDockerState().then(x => {
      if (!x.ok) {
        return // impossible
      }
      brushDocker.setSize(x.data.size)
      brushDocker.setVisible(true)
      brushDocker.setPos([left, bottom + 10])
    })
  }, [displayDocker, brushDocker])

  const toggleBrushDocker = useCallback(() => {
    displayDockerChanged(!displayDocker)
  }, [displayDocker, displayDockerChanged])


  const brushButtonClick = useCallback(() => {
    if (brushEnabled) {
      toggleBrushDocker()
      return
    }
    setState({ tool: 'KritaShape/KisToolBrush' })
  }, [brushEnabled, toggleBrushDocker, setState])


  useKritaLatestAction('KritaShape/KisToolBrush', async () => {
    // 如果接受到该action时，当前工具居然不是笔刷，这证明要么是
    // 没有视图，要么是快捷键返回的居然比state/get快，后者的情况下
    // 应当证明是该次快捷键按下触发的工具切换
    if (!brushEnabled) {
      return
    }

    // 如果上次笔刷状态和本次笔刷状态不同，同样证明此
    if (state.tool !== lastState.tool) {
      return
    }

    // 只有两次时状态都为笔刷工具才证明此时是在笔刷工具的情况下按下 B

    toggleBrushDocker()
  }, [toggleBrushDocker, lastState.tool, brushEnabled, state.tool])


  return (
    <>
      <Button size={'md'} pos='relative' ref={buttonRef} rounded={'50%'} padding={0} border={brushEnabled ? `3px solid #3daee9}` : void 0} colorScheme="teal" variant={'solid'} onClick={brushButtonClick}>
        <Image src={brushResourceIcon || brushIcon} rounded={'50%'} h="100%" w="100%"></Image>
        {!state.eraserMode ? void 0 :
          <Image pos='absolute' transform={'translate(40%, 40%)'} bottom={0} right={0} h={"50%"} src={eraserIcon}></Image>
        }
      </Button>
    </>
  )
}
export default BrushButton