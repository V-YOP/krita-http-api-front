import { Card, CardBody, HStack, Tag } from "@chakra-ui/react";
import { BG } from "@renderer/constants";
import { useKritaState } from "@renderer/hooks/useKritaState";
import useTodayDrawSeconds from "@renderer/hooks/useTodayDrawSeconds";
import Interactable from "@renderer/components/Interactable";
import { secondsTohhmmss } from "@renderer/util";


function TopStatusBar(): JSX.Element {
  const [{theme, tool, brushSize, brushRotation, editTime, fileName, picResolution, blendingMode, flow, opacity, pattern, gradient }] = useKritaState()

  const todayDrawSeconds = useTodayDrawSeconds()
  return (
    <Interactable style={{top: 0, left: 0}}>
      <Card bg={BG[theme] + 'dd'} width='fit-content' rounded={0} roundedBottomRight={'12px'}>
        <CardBody pt={1} pb={1}>
          <HStack>
            <Tag colorScheme="blue">编辑：{secondsTohhmmss(editTime)}</Tag>
            <Tag colorScheme="blue">本日编辑：{secondsTohhmmss(todayDrawSeconds)}</Tag>
            <Tag colorScheme={fileName ? "blue" : "red"}>图像：{fileName ? fileName : '未保存'}</Tag>
            <Tag colorScheme="blue">图像分辨率：{`${picResolution[0]}x${picResolution[1]}`}</Tag>
            <Tag colorScheme="blue">工具：{tool}</Tag>  
            <Tag colorScheme="blue">混合模式：{blendingMode}</Tag>
            <Tag colorScheme="blue">笔刷大小：{Math.round(brushSize)} px</Tag>
            <Tag colorScheme="blue">笔刷不透明度：{Math.round(opacity * 100)} %</Tag>
          </HStack>
        </CardBody>
      </Card>
    </Interactable>
  )
}


export default TopStatusBar