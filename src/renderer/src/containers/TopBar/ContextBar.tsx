import { Button, HStack, Image } from "@chakra-ui/react";
import { ICONS, TOOL_ICONS } from "@renderer/constants";
import useBrushHistory from "@renderer/hooks/useBrushHistory";
import { useKritaResourceIcons } from "@renderer/hooks/useKritaResourceIcon";
import { useKritaState } from "@renderer/hooks/useKritaState";
import { uniq } from "lodash";
import { useMemo } from "react";


function ContextBar(): React.ReactElement {
  const [{ tool, brushPreset }, setKritaState] = useKritaState()
  const brushHistory = useBrushHistory()
  const brushIcons = useKritaResourceIcons(useMemo(() => brushHistory.map(h => ['preset', h]), [brushHistory]))

  if (tool === 'KritaShape/KisToolBrush') {
    return (
      <HStack m={0} p={0}>
        {brushHistory.map((brushHistory, i) => {
          return (
            <Button
              key={i + brushHistory}
              size={'md'}
              pos='relative'
              rounded={'50%'}
              padding={0}
              border={brushHistory === brushPreset ? `3px solid #3daee9}` : void 0}
              colorScheme="teal"
              onClick={() => setKritaState({ brushPreset: brushHistory })}
              variant={'solid'}>
              <Image src={brushIcons[i]} rounded={'50%'} h="100%" w="100%"></Image>
            </Button>
          )
        })}
      </HStack>
    )
  }
  return (
    <></>
  );
}

export default ContextBar