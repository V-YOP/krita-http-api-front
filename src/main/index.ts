import { app, shell, BrowserWindow, ipcMain, Tray, Menu, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

((async () => {
  const { activeWindow } = await import('active-win')
  console.log(activeWindow)

  function createWindow(): void {
    // Create the browser window.
  
    // 获取主显示器的尺寸
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
  
  
    const mainWindow = new BrowserWindow({
      width, height,
      x: 0, y: 0,
      useContentSize: true, // 使用内容尺寸
      
      show: true,
      autoHideMenuBar: true,
      transparent: true,
  
      frame: false,
      skipTaskbar: true,
  
      alwaysOnTop: true,
      focusable: false,
  
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        nodeIntegration: false,
        contextIsolation: false,
      },
    })
  
    // 强制窗口置于任务栏之上（
    
    // mainWindow.on('blur', () => mainWindow.setAlwaysOnTop(true, 'screen-saver'));
    // mainWindow.on('show', () => mainWindow.setAlwaysOnTop(true, 'screen-saver'));
    // mainWindow.setAlwaysOnTop(true, 'screen-saver')
    mainWindow.setIgnoreMouseEvents(true, {forward: true})
    mainWindow.setVisibleOnAllWorkspaces(true);
    mainWindow.setFullScreenable(false);
  
    ipcMain.handle('get-screen-zoom-factor', () => {
      return screen.getPrimaryDisplay().scaleFactor
    })

    ipcMain.on('show-me', () => {
      // const win = BrowserWindow.fromWebContents(event.sender)
      // console.log('me show')
      // win?.showInactive()
    })
  
    ipcMain.on('hide-me', () => {
      // const win = BrowserWindow.fromWebContents(event.sender)
      // console.log('me hide')
      // win?.hide()
    })
  
    ipcMain.on('toggle-transparent-mode', () => {
      
    })
  
    ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
      const win = BrowserWindow.fromWebContents(event.sender)
      win?.setIgnoreMouseEvents(ignore, options)
    })
  
  
  
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
  
          'Access-Control-Allow-Origin': ['*'],
          ...details.responseHeaders
        }
      })
    })
  
    mainWindow.on('ready-to-show', () => {
      mainWindow.show()
    })
  
    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
  
    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
  }
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    const tray = new Tray(icon);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'show',
        click: () => {
          BrowserWindow.getAllWindows()[0].show()
        }
      },
      {
        label: 'hide',
        click: () => {
          BrowserWindow.getAllWindows()[0].hide()
        }
      },
      {
        label: 'devTool',
        click: function() {
          BrowserWindow.getAllWindows()[0].webContents.openDevTools()
        }
      },
      {
        label: '退出',
        click: function () {
          app.quit();
        }
      },
    ]);
    tray.setToolTip('应用标题');
    tray.setContextMenu(contextMenu);
    // tray.
    tray.on('right-click', () => {
      console.log('right click tray!')
    })
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')
  
    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })
  
    // IPC test
    ipcMain.on('ping', () => console.log('pong'))
  
    createWindow()
  
    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
  
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    // if (process.platform !== 'darwin') {
    //   app.quit()
    // }
  })
  
  // In this file you can include the rest of your app"s specific main process
  // code. You can also put them in separate files and require them here.
  
  
  












})());

