/****************************************************
*                                                   *
*   main.js                                         *
*                                                   *
*   ...                                             *
*                                                   *
*****************************************************/

let tray
const path = require("node:path")
const { app, Tray, Menu, nativeImage, BrowserWindow, ipcMain } = require("electron/main")


function GetWindowCount() {
    return BrowserWindow.getAllWindows().length
}

const CreateWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        },
        backgroundColor: '#222222'
        // frame: false,
        // titleBarStyle: 'hidden',
        // titleBarOverlay: true,
        // titleBarOverlay: {
        //     color: '#2f3241',
        //     symbolColor: '#74b1be',
        //     height: 60
        // }
    })
    win.loadFile("app/index.html")
    // return win
}



app.whenReady().then(() => {
    ipcMain.handle("ping", () => "pong")

    CreateWindow()
    app.on("activate", () => {
        if (GetWindowCount() === 0) {
            CreateWindow()
        }
    })

    const icon = nativeImage.createFromPath('images/rune_new2.png')
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
        { label: 'New Window', type: 'normal', click: CreateWindow },
        { label: 'Hide', type: 'normal', role: 'hide' },
        { label: 'Show', type: 'normal', click: app.show },
        // { label: 'Item1', type: 'radio' },
        // { label: 'Item2', type: 'radio' },
        // { label: 'Item3', type: 'radio', checked: true },
        // { label: 'Item4', type: 'radio' },
        { label: 'Quit',  type: 'normal', role: 'quit' },
    ])
    tray.setContextMenu(contextMenu)
    tray.setTitle('Electron Test Application')
    tray.setToolTip('Electron Test Application')
})


app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})


