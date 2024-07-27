import { ElectronAPI } from '@electron-toolkit/preload'
import { activeWindow } from 'active-win'
declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      enableMouseEvent(): void,
      disableMouseEvent(): void,
      delayTest(): Promise<void>,
      setIgnoreMouseEvents(enable: boolean, option: {forward: boolean}): void,
      toggleTransparentMode(): void,
      activeWindow: typeof activeWindow,
      showMe(): void,
      hideMe(): void,
      getZoomFactor: () => Promise<number>
    },
  }
}
