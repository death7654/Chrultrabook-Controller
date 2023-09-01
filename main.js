const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os')
const os2 = require('os-utils');
const temps = require('./app/ectools/cpuTemp.js');
const fanSpeed = require('./app/ectools/fanRPM.js');
const fanMax = require('./app/ectools/setFanMaxSpeed.js');
const fanAuto = require('./app/ectools/setFanAuto.js');
const fanOff = require('./app/ectools/setFanOff.js');
const memcb = require('./app/ectools/cbmem.js')
const nameCPU = require('./app/systemInformation/cpuName.js')
const hostname = require('./app/systemInformation/hostname.js')
const cpuCore = require('./app/systemInformation/cores.js')
const boardname = require('./app/systemInformation/boardName.js')
const osName = require('./app/systemInformation/os.js')
const biosVersion = require('./app/systemInformation/biosVersion.js')

app.whenReady().then(() => {
  ipcMain.on('sentcommand', handleSetTitle)
})

global.mainWindow = null;

function handleSetTitle (event, title) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}

function createWindow(){
  global.mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "/app/Icons/app/icon.ico"),
    width: 800, //px
    height: 550, //px
    autoHideMenuBar: true,
    //frame: false,
    webPreferences: {
      devTools: false,
      sandbox: false,
      nodeIntegration: false,
      preload: path.join(__dirname, "./backend/preload.js"),
      enableRemoteModule: false,
      contextIsolation: true,
    },
    //frame: false,
    resizable: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#ffffff',
    }
  })
  mainWindow.loadFile(path.join(__dirname, "app/index.html"));
}
function systemInfo(){
  if (!mainWindow) return;
  nameCPU.cpuName();
  hostname.hostname();
  cpuCore.coreCPU();
  boardname.boardname();
}

app.on('ready', createWindow);
app.on('window-all-closed', function() {
    app.quit();
})
function systemInfo(){
  if (!mainWindow) return;
  nameCPU.cpuName();
  hostname.hostname();
  cpuCore.coreCPU();
  boardname.boardname();
  osName.osName();
  biosVersion.biosVersion();
}

//update functions for index.html

function sendData() {
    if (!mainWindow) return;
    os2.cpuUsage(function(v){
        mainWindow.webContents.send('cpu',v*100);
        mainWindow.webContents.send('mem',os2.freememPercentage()*100);
    })  
    temps.getTemps(); // makes cpu temps work, a highly botched solution
    fanSpeed.getFanSpeed();

}

setInterval(sendData, 1000);



ipcMain.on('ectool', (event, mode) => {
    //console.log('recieved');
    if (mode === 1)  {
        fanMax.setFanSpeedMax();
        //console.log(mode);
    }
    else if (mode === 2) {
        fanOff.setFanOff();
        //console.log(mode);
    } else if (mode === 3) {
    fanAuto.setFanAuto();
    //console.log(mode);
    }else if (mode === 4){
        //console.log(mode);
        memcb.cbMem();
    }else if (mode === 5){
      //console.log(mode);
      setTimeout(systemInfo, 1000)

    }
});

ipcMain.on('requestData', (e) => {
    //new iframe loading...
    sendData();
})
