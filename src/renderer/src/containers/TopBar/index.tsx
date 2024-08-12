import { Box, Button, Card, CardBody, HStack, Image } from "@chakra-ui/react"
import { BG, ICONS, TOOL_ICONS, ACTIVE_BG } from "@renderer/constants"
import BrushButton from "@renderer/containers/TopBar/BrushButton"
import Interactable from "@renderer/components/Interactable"
import {useKritaIcon} from "@renderer/hooks/useKritaIcon"
import { useState, useEffect, useMemo, useCallback } from "react"
import ToolGroupButton from "@renderer/containers/TopBar/ToolGroupButton"
import { useKritaState } from "@renderer/hooks/useKritaState"
import DockerButton from "@renderer/containers/TopBar/DockerButton"
import { secondsTohhmmss } from "@renderer/util"
import useTodayDrawSeconds from "@renderer/hooks/useTodayDrawSeconds"
import ContextBar from "@renderer/containers/TopBar/ContextBar"

function TopBar(): JSX.Element {
  const [{theme, tool, editTime, picResolution, ...state}, ] = useKritaState()

  const [displayBrushDocker, setDisplayBrushDocker] = useState(false)
  const [displayToolGroup, setDisplayToolGroup] = useState<[boolean,boolean,boolean,boolean]>([false,false,false,false])

  const toolOnlyDisplayMe = useCallback((i: number, display: boolean) => {
    setDisplayToolGroup(displays => {
      return displays.map((_, j) => j === i ? display : false) as [boolean,boolean,boolean,boolean]
    })
  }, [])

  const [displayDocker, setDisplayDocker] = useState<[boolean,boolean]>([false,false])
  const dockerOnlyDisplayMe = useCallback((i: number, display: boolean) => {
    setDisplayDocker(displays => {
      return displays.map((_, j) => j === i ? display : false) as [boolean,boolean]
    })
  }, [])

  return (
    <Interactable style={{top: '50px', left: '250px'}}>
      <Card bg={BG[theme] + 'dd'} w='1440px' maxW='1440px' rounded={'12px'}>
        <CardBody pt={2} pb={2}>
          <HStack>
            <BrushButton displayDocker={displayBrushDocker} displayDockerChanged={setDisplayBrushDocker}></BrushButton>
            <ToolGroupButton displayGroup={displayToolGroup[0]} displayGroupChanged={useCallback((display) => toolOnlyDisplayMe(0, display), [toolOnlyDisplayMe])} tools={useMemo(()=>[
                'KisToolSelectOutline',
                'KisToolSelectElliptical',
                'KisToolSelectRectangular',
                'KisToolSelectPolygonal',
                'KisToolSelectSimilar',
                'KisToolSelectMagnetic' // 磁锁选择
            ], [])}/>
            
            <ToolGroupButton displayGroup={displayToolGroup[1]} displayGroupChanged={useCallback((display) => toolOnlyDisplayMe(1, display), [toolOnlyDisplayMe])}  tools={useMemo(()=>[
                'KisToolPolyline',
                'KritaShape/KisToolLine',
                'KritaShape/KisToolRectangle',
                'KritaShape/KisToolEllipse'
            ], [])}/>
            
            <ToolGroupButton displayGroup={displayToolGroup[2]} displayGroupChanged={useCallback((display) => toolOnlyDisplayMe(2, display), [toolOnlyDisplayMe])}  tools={useMemo(()=>[
                'KritaFill/KisToolFill',
                'KritaFill/KisToolGradient',
                'KritaShape/KisToolLazyBrush', // 智能填色（取得什么名字……）
            ], [])}/>
            
            
            <ToolGroupButton displayGroup={displayToolGroup[3]} displayGroupChanged={useCallback((display) => toolOnlyDisplayMe(3, display), [toolOnlyDisplayMe])}  tools={useMemo(()=>[
                'ToolReferenceImages',
                'KisToolCrop',
                'KritaShape/KisToolMeasure',
                'KisAssistantTool',
                'SvgTextTool',
                'KritaSelected/KisToolColorSampler'
            ], [])}/>
            <Box flexGrow={0} flexBasis={"100%"} flexShrink={1}><ContextBar /></Box>
            <Box ml={'auto'}></Box>
            <Button size={'md'} pos='relative' backgroundColor={`rgb(${state.foreground.map(x => uniformToRGBChannel(x)).join(',')})`} rounded={'50%'} padding={0} border={`1px solid white}`} colorScheme="teal" variant={'solid'} _hover={''}>
              </Button>
            <DockerButton docketObjectName="KisLayerBox" iconName={ICONS.LAYER_DOCKER} displayDocker={displayDocker[0]} displayDockerChanged={(display)=> dockerOnlyDisplayMe(0, display)} />
            <DockerButton docketObjectName="sharedtooldocker" iconName={ICONS.TOOL_OPTION_DOCKER} displayDocker={displayDocker[1]} displayDockerChanged={(display)=> dockerOnlyDisplayMe(1, display)} />
          </HStack>
        </CardBody>
      </Card>
    </Interactable>
  )

}

function uniformToRGBChannel(v: number) {
  return Math.round(v * 255)
}

export default TopBar
