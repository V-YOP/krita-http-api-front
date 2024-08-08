import { Button, Image } from "@chakra-ui/react";
import { ACTIVE_BG } from "@renderer/constants";
import useKritaDocker from "@renderer/hooks/useKritaDocker";
import { useKritaIcon } from "@renderer/hooks/useKritaIcon";
import { useKritaState } from "@renderer/hooks/useKritaState";
import { useCallback, useEffect, useRef } from "react";

type DockerButtonParam = {
  docketObjectName: string,
  iconName: string,
  displayDocker: boolean,
  displayDockerChanged: (display: boolean) => void,
}

function DockerButton({ docketObjectName, iconName, displayDocker, displayDockerChanged }: DockerButtonParam) {
  const [state] = useKritaState()
  const docker = useKritaDocker(docketObjectName)

  const iconBase64 = useKritaIcon(iconName)
  const buttonRef = useRef(null as unknown as HTMLButtonElement)

  useEffect(() => {
    if (!displayDocker) {
      // hide me
      docker.setVisible(false)
      return
    }
    const btn = buttonRef.current
    const { bottom, left } = btn.getBoundingClientRect();
    docker.getDockerState().then(x => {
      if (!x.ok) {
        return // impossible
      }
      docker.setSize(x.data.size)
      docker.setVisible(true)
      docker.setPos([left, bottom + 10])
    })
  }, [displayDocker, docker])

  const toggleDocker = useCallback(() => {
    displayDockerChanged(!displayDocker)
  }, [displayDocker, displayDockerChanged])


  const buttonClick = useCallback(() => {
    toggleDocker()
  }, [toggleDocker])


  //   useKritaLatestAction('KritaShape/KisToolBrush', async () => {
  //     // 如果接受到该action时，当前工具居然不是笔刷，这证明要么是
  //     // 没有视图，要么是快捷键返回的居然比state/get快，后者的情况下
  //     // 应当证明是该次快捷键按下触发的工具切换
  //     if (!brushEnabled) {
  //       return
  //     }

  //     // 如果上次笔刷状态和本次笔刷状态不同，同样证明此
  //     if (state.tool !== lastState.tool) {
  //       return
  //     }

  //     // 只有两次时状态都为笔刷工具才证明此时是在笔刷工具的情况下按下 B

  //     toggleDocker()
  //   }, [toggleDocker, lastState.tool, brushEnabled, state.tool])


  return (
    <>
      <Button ref={buttonRef} rounded={'30%'} padding={2} colorScheme="teal" variant={'ghost'} onClick={buttonClick}
        bgColor={displayDocker ? ACTIVE_BG[state.theme] : void 0}>
        <Image src={iconBase64} h="100%" w="100%" />
      </Button>

    </>
  )
}
export default DockerButton