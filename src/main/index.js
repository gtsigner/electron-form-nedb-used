'use strict'

import {app, BrowserWindow, Tray, Menu, dialog} from 'electron'
import {Server} from '../server'

import {ipcMain} from 'electron'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow = null;
let tray = null;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 960,
    useContentSize: false,
    width: 860,
    //resizable: false,
    title: '表单记录器',

    //frame: false,
    // height: 760,
    // useContentSize: true,
    // width: 1050
  });

  tray = new Tray(__dirname + '/../../static/favicon.ico');
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开主界面', type: 'normal', click: () => {
        mainWindow.show();
        if (mainWindow) {
          if (mainWindow.isMinimized()) mainWindow.restore()
          mainWindow.focus()
        }
      }
    },
    {label: '', type: 'separator'},
    {
      label: '退出', type: 'normal', click: () => {
        //mainWindow = null;
        app.quit();
        app.quit();
      }
    }
  ])
  tray.setToolTip('表单记录器')
  tray.setContextMenu(contextMenu)

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
    tray = null;
  });
  mainWindow.on('close', (e) => {
    //回收BrowserWindow对象
    if (mainWindow.isMinimized()) {

    } else {
      e.preventDefault();
      mainWindow.minimize();
    }
  });
  mainWindow.beforeunload = (e) => {
    e.returnValue = false;

  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
ipcMain.on('choose', (e) => {
  dialog.showOpenDialog({
    title: '选择导出文件夹',
    properties: ['openDirectory']
  }, (filePath) => {
    e.sender.send('chooseOk', filePath)
  })
});
