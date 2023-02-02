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
    width: isDev ? 1200 : 800,
    height: 800,
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
  mainWindow.webContents.send('get_ip', "","");
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
    width: isDev ? 1200 : 500,
    height: 800,
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

  const execSync = require('child_process').execSync;



  let scan_wifi_data = "";
  //const output = execSync('python run_wifi.py', { encoding: 'utf-8' })
  //const wifi_off =  spawn('python', ['./renderer/python/wifi_off.py'],{ encoding: 'utf8' });
  const pyprog = spawn('python', ['./renderer/python/run_wifi.py', ]);
  // const wifi_on =  spawn('python', ['./renderer/python/wifi_on.py'],{ encoding: 'utf8' });

  fs.readFile(" wifipass.txt", "utf-8", (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log("READ DATA",data);
    secondWindow.webContents.send('wifi:output', "","data");


  }
});


});



ipcMain.on('EvilScan', (e) => {
  evilwindow = new BrowserWindow({
    width: isDev ? 1200 : 500,
    height: 800,
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
    // evilwindow.webContents.openDevTools();
  }

// Load the HTML file for the second window
  evilwindow.loadFile('./renderer/evil.html');
// Send data to the second window when it's ready to receive
  evilwindow.webContents.on('did-finish-load', () => {
    evilwindow.webContents.send('data', 'Hello from the main process!');
    const options = {
      target:'10.3.0.1/24',
      port:'80,8000,3000,8081,3306;9090,9091,8080,443,5000',
  status:'Open', // Timeout, Refused, Open, Unreachable
      banner:true
    };



    const evilscan = new Evilscan(options);
    let overalldata ="";
    evilscan.on('result',data => {
      // fired when item is matching options
      console.log(data);
      overalldata = overalldata + JSON.stringify(data)
      evilwindow.webContents.send('EvilScan:output', "",overalldata);


    });

    evilscan.on('error', err => {
      throw new Error(data.toString());
    });

    evilscan.on('done', () => {
      // finished !
    });
    evilscan.run()


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

