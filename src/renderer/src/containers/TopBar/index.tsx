import { Button, Card, CardBody, HStack, Image } from "@chakra-ui/react"
import { BG, ICONS, TOOL_ICONS, ACTIVE_BG } from "@renderer/constants"
import BrushButton from "@renderer/containers/TopBar/BrushButton"
import Interactable from "@renderer/Interactable"
import {useKritaIcon} from "@renderer/hooks/useKritaIcon"
import { useState, useEffect, useMemo, useCallback } from "react"
import ToolGroupButton from "@renderer/containers/TopBar/ToolGroupButton"
import { useKritaState } from "@renderer/hooks/useKritaState"

const THEME = "Breeze Dark"

function TopBar(): JSX.Element {
  const [{theme, tool, }, ] = useKritaState()

  const [displayBrushDocker, setDisplayBrushDocker] = useState(false)
  const [displayToolGroup, setDisplayToolGroup] = useState<[boolean,boolean,boolean,boolean]>([false,false,false,false])
  const onlyDisplayMe = useCallback((i: number, display: boolean) => {
    setDisplayToolGroup(displays => {
      return displays.map((_, j) => j === i ? display : false) as [boolean,boolean,boolean,boolean]
    })
  }, [])
  return (
    <Interactable style={{top: '6px', left: '250px'}}>
      <Card bg={BG[theme] + 'dd'} width='1440px' rounded={'12px'}>
        <CardBody pt={2} pb={2}>
          <HStack>
            <BrushButton displayDocker={displayBrushDocker} displayDockerChanged={setDisplayBrushDocker}></BrushButton>
            <ToolGroupButton displayGroup={displayToolGroup[0]} displayGroupChanged={(display) => onlyDisplayMe(0, display)} tools={useMemo(()=>[
                'KisToolSelectOutline',
                'KisToolSelectElliptical',
                'KisToolSelectRectangular',
                'KisToolSelectPolygonal',
                'KisToolSelectSimilar'
            ], [])}/>
            
            <ToolGroupButton displayGroup={displayToolGroup[1]} displayGroupChanged={(display) => onlyDisplayMe(1, display)}  tools={useMemo(()=>[
                'KisToolPolyline',
                'KritaShape/KisToolLine',
                'KritaShape/KisToolRectangle',
                'KritaShape/KisToolEllipse'
            ], [])}/>
            
            <ToolGroupButton displayGroup={displayToolGroup[2]} displayGroupChanged={(display) => onlyDisplayMe(2, display)}  tools={useMemo(()=>[
                'KritaFill/KisToolFill',
                'KritaShape/KisToolLazyBrush', // 智能填色（取得什么名字……）
                'KritaFill/KisToolGradient',
                'KisToolSelectMagnetic' // 磁锁选择
            ], [])}/>
            
            
            <ToolGroupButton displayGroup={displayToolGroup[3]} displayGroupChanged={(display) => onlyDisplayMe(3, display)}  tools={useMemo(()=>[
                'ToolReferenceImages',
                'KisToolCrop',
                'KritaShape/KisToolMeasure',
                'KisAssistantTool',
                'SvgTextTool',
                'KritaSelected/KisToolColorSampler'
            ], [])}/>
            <p>{tool}</p>
            <Button ml={'auto'}>toggle</Button>
          </HStack>
        </CardBody>
      </Card>
    </Interactable>
  )

}

export default TopBar
