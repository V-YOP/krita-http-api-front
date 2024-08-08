import { ipcRenderer, webFrame  } from 'electron'
import { exposeElectronAPI } from '@electron-toolkit/preload'

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
window['api'].getTodayDrawSeconds = () => {
    return ipcRenderer.invoke('get-today-draw-seconds')
}