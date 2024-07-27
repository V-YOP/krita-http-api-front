import { Box, Button, Card, CardBody, HStack, Image, useBoolean } from "@chakra-ui/react"
import { ACTIVE_BG, BG, TOOL_ICONS, ToolName } from "@renderer/constants"
import BrushButton from "@renderer/containers/TopBar/BrushButton"
import { useKritaIcons } from "@renderer/hooks/useKritaIcon"
import { useKritaState } from "@renderer/hooks/useKritaState"
import Interactable from "@renderer/Interactable"
import { useCallback, useEffect, useMemo, useState } from "react"

type ToolGroupButtonParam = {
	tools: ToolName[],
	displayGroup: boolean,
	displayGroupChanged: (display: boolean) => void,
}

function ToolGroupButton({ tools, displayGroup, displayGroupChanged }: ToolGroupButtonParam) {
	const [state, setState] = useKritaState()
	const icons = useKritaIcons(useMemo(() => tools.map(x => TOOL_ICONS[x]), [tools]))

	// 上次checked的组中的工具
	const [lastCheckedToolIndex, setLastCheckedToolIndex] = useState(-1)
	useEffect(() => {
		return () => {
			const idx = tools.findIndex(t => t === state.tool)
			if (idx !== -1) {
				setLastCheckedToolIndex(idx)
			}
		}
	}, [state.tool, tools])

	const checkedToolIndex = useMemo(() => {
		const res = tools.findIndex(t => t === state.tool)
		// 如果当前没有checked的tool，关闭
		if (res === -1 && displayGroup) {
			displayGroupChanged(false)
		}
		return res
	}, [state.tool, tools, displayGroup, displayGroupChanged])

	const displayedToolIconIndex = useMemo(() => {
		// 如果当前已经选中相应工具，显示相应工具
		if (checkedToolIndex !== -1) {
			return checkedToolIndex
		}
		// 否则，检查是否有上一次选择的工具，如果有，显示该工具
		if (lastCheckedToolIndex !== -1) {
			return lastCheckedToolIndex
		}
		// 否则，显示第一个工具
		return 0
	}, [checkedToolIndex, lastCheckedToolIndex])



	const onMainButtonClick = useCallback(() => {
		// 如果当前已经checked了，toggle 悬浮窗
		if (checkedToolIndex !== -1) {
			displayGroupChanged(!displayGroup)
			return
		}
		// 否则切换到当前展示的工具
		setState({ tool: tools[displayedToolIconIndex] })
	}, [checkedToolIndex, displayGroup, displayGroupChanged, displayedToolIconIndex, setState, tools])

	// 点击子菜单按钮时
	const groupButtonClick = useCallback((i: number) => {
		// 如果不是当前active的工具，设置它
		if (checkedToolIndex !== i) {
			setState({ tool: tools[i] })
		}
		// 然后toggle子菜单
			displayGroupChanged(!displayGroup)
	}, [checkedToolIndex, displayGroup, displayGroupChanged, setState, tools])

	return (
		<Box pos={'relative'}>
			<Button rounded={'30%'} padding={2} colorScheme="teal" variant={'ghost'} onClick={onMainButtonClick}
				bgColor={checkedToolIndex !== -1 ? ACTIVE_BG[state.theme] : void 0}>
				<Image src={icons[displayedToolIconIndex]} h="100%" w="100%" />
			</Button>
			<Interactable style={{ bottom: '-10px', left: '0px', transform: 'translate(0%,100%)' }}>
				{!displayGroup ? void 0:
				<Card bg={BG[state.theme] + 'dd'} width='fit-content' rounded={'12px'}>
				<CardBody pt={1} pb={1} pl={1} pr={1}>
					<HStack >
						{tools.map((tool, i) => {
							return (
								<Button key={tool} rounded={'30%'} padding={2} colorScheme="teal" variant={'ghost'} onClick={() => groupButtonClick(i)}
									bgColor={checkedToolIndex === i ? ACTIVE_BG[state.theme] : void 0}>
									<Image src={icons[i]} h="100%" w="100%" />
								</Button>
							)
						})}
					</HStack>
				</CardBody>
			</Card>
				}
			</Interactable>
		</Box>
	)
}


export default ToolGroupButton