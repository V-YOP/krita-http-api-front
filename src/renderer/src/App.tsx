
import { useEffect, useState } from 'react'
import Interactable from '@renderer/Interactable'
import { useKritaStateApi, useKritaApi } from '@renderer/hooks/useKritaHttpApi'
import { Card, CardBody, useColorMode } from '@chakra-ui/react'
import TopBar from '@renderer/containers/TopBar'



function App(): JSX.Element {

  // const {setColorMode} = useColorMode()
  // useEffect(() => {
  //   setColorMode('dark')
  // }, [setColorMode])



  return (
    <div>
      <TopBar></TopBar>
    </div>
  )
}


export default App
