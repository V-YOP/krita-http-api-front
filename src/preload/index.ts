import { contextBridge, ipcRenderer, session, webFrame  } from 'electron'
import { electronAPI, exposeElectronAPI } from '@electron-toolkit/preload'

exposeElectronAPI()

// @ts-ignore
window['api'] ??= {}
window['api'].setIgnoreMouseEvents = (enable: boolean, option: {forward: boolean}):void => {
    ipcRenderer.send('set-ignore-mouse-events', enable, option)
}

window['api'].toggleTransparentMode = () => {
    ipcRenderer.send('toggle-transparent-mode')
}

window['api'].showMe = () => {
    ipcRenderer.send('show-me')
}
window['api'].hideMe = () => {
    ipcRenderer.send('hide-me')
}
window['api'].getZoomFactor = async () => {
    return webFrame.getZoomFactor() * await ipcRenderer.invoke('get-screen-zoom-factor')
}