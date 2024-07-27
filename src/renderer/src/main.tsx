import './assets/index.css'

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'


import { ChakraProvider } from '@chakra-ui/react'

import { extendTheme } from '@chakra-ui/react'
import { KritaProvider } from '@renderer/KritaProvider'
import { useKritaState } from "@renderer/hooks/useKritaState"
import { sleep } from '@renderer/util'

const theme = extendTheme({
  colors: {
    chakra: {
      body: {
        bg: '#31363b'
      }
    }
  }
})

function WhenCanvasOnly({children}: {children: React.ReactNode}) {
  const [{canvasOnly}] = useKritaState()

  // useEffect(() => {
  //   let stop = false;
  //   ((async () => {
  //     while (true) {
  //       if (stop) {
  //         return
  //       }
  //       await sleep(500)
  //       if (!canvasOnly) {
  //         continue
  //       }
  //       const activeWindow = await window.api.activeWindow()
  //       if (!activeWindow) {
  //         window.api.hideMe()
  //         continue
  //       }
  //       if (activeWindow.owner.path.endsWith('krita.exe') || activeWindow.owner.path.endsWith('krita') || activeWindow.owner.path.endsWith('Krita')) {
  //         window.api.showMe()
  //       } else {
  //         window.api.hideMe()
  //       }
  //     }
  //   })())
  //   return () => {
  //     stop = true
  //   }
  // }, [canvasOnly])

  return children
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <KritaProvider>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </KritaProvider>
  </React.StrictMode>
)
