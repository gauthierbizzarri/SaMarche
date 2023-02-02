const path = require('path');
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img');
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const { spawn } = require('child_process');
const Evilscan = require('evilscan');

// Set env
const isDev = process.env.NODE_ENV !== 'dev';
const isMac = process.platform === 'darwin';

// Set up the main window
let mainWindow;
let aboutWindow;



// Main Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: isDev ? 1000 : 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Show devtools automatically if in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
    // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
   mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

// About Window
function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    width: 300,
    height: 300,
    title: 'About Electron',
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
  });

   aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
}

// When the app is ready, create the window
app.on('ready', () => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
  // Remove variable from memory
  mainWindow.on('closed', () => (mainWindow = null));
});

// Menu template
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: 'About',
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: 'fileMenu',
  },
  ...(!isMac
    ? [
        {
          label: 'Help',
          submenu: [
            {
              label: 'About',
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  // {
  //   label: 'File',
  //   submenu: [
  //     {
  //       label: 'Quit',
  //       click: () => app.quit(),
  //       accelerator: 'CmdOrCtrl+W',
  //     },
  //   ],
  // },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
];



// scan ip

const options = {
  target:'10.3.0.0/24',
  port:'0-65535',
  status:'TROU', // Timeout, Refused, Open, Unreachable
  banner:true
};



const evilscan = new Evilscan(options);

evilscan.on('result',data => {
  // fired when item is matching options
  console.log(data);
});

evilscan.on('error', err => {
  throw new Error(data.toString());
});

evilscan.on('done', () => {
  // finished !
});


ipcMain.on('scanIp:ip', (e) => {
  scaIpWindow = new BrowserWindow({
    width: isDev ? 1000 : 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Show devtools automatically if in development
  if (isDev) {
    scaIpWindow.webContents.openDevTools();
  }

// Load the HTML file for the second window
  scaIpWindow.loadFile('./renderer/ip.html');
// Send data to the second window when it's ready to receive
  scaIpWindow.webContents.on('did-finish-load', () => {
    scaIpWindow.webContents.send('data', 'Hello from the main process!');
});
});


ipcMain.on('scan:wifi', (e) => {
  secondWindow = new BrowserWindow({
    width: isDev ? 1000 : 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Show devtools automatically if in development
  if (isDev) {
    secondWindow.webContents.openDevTools();
  }

// Load the HTML file for the second window
  secondWindow.loadFile('./renderer/wifi.html');
// Send data to the second window when it's ready to receive
  secondWindow.webContents.on('did-finish-load', () => {
    secondWindow.webContents.send('data', 'Hello from the main process!');
  });


  let scan_wifi_data = "";
  console.log("python:wifi");
  const wifi_off =  spawn('python', ['./renderer/python/wifi_off.py'],{ encoding: 'utf8' });
  const pyprog = spawn('python', ['./renderer/python/scanWifi.py'],{ encoding: 'utf8' });
  const wifi_on =  spawn('python', ['./renderer/python/wifi_on.py'],{ encoding: 'utf8' });
  pyprog.stdout.on('data', data=>{
    //scan_wifi_data = scan_wifi_data+
    //Buffer.from(data, 'utf-8').toString();
    scan_wifi_data = "<p> Running Scan Wifi ....</p>"
    console.log("BEGIN");
    console.log(
    scan_wifi_data = scan_wifi_data+
    Buffer.from(data, 'utf-8').toString());
    console.log("END");
    secondWindow.webContents.send('python:wifi', "",scan_wifi_data);
  });
});



ipcMain.on('EvilScan', (e) => {
  evilwindow = new BrowserWindow({
    width: isDev ? 1000 : 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Show devtools automatically if in development
  if (isDev) {
    evilwindow.webContents.openDevTools();
  }

// Load the HTML file for the second window
  evilwindow.loadFile('./renderer/wifi.html');
// Send data to the second window when it's ready to receive
  evilwindow.webContents.on('did-finish-load', () => {
    evilwindow.webContents.send('data', 'Hello from the main process!');
    evilscan.run();
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

// Open a window if none are open (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

