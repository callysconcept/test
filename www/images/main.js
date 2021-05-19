require('update-electron-app')({
  logger: require('electron-log')
})

const path = require('path')
const glob = require('glob')
const {app, BrowserWindow} = require('electron')

const debug = /--debug/.test(process.argv[2])

if (process.mas) app.setName('Electron APIs')

let mainWindow = null

function initialize () {
  makeSingleInstance()

  loadDemos()


let loadingScreen;
const createLoadingScreen = () => {
  /// create a browser window
  loadingScreen = new BrowserWindow(
    Object.assign({
      /// define width and height for the window
      width: 350,
      height: 350,
      /// remove the window frame, so it will become a frameless window
      frame: false,
      /// and set the transparency, to remove any window background color
      transparent: true,
	  alwaysOnTop: true,
	  focusable: false
    })
  );
  loadingScreen.setResizable(false);
  loadingScreen.center();
  loadingScreen.loadURL(
    'file://' + __dirname + '/loading.html'
  );
  loadingScreen.on('closed', () => (loadingScreen = null));
  loadingScreen.webContents.on('did-finish-load', () => {
    loadingScreen.show();
  });
};
  function createWindow () {
  
    const windowOptions = {
		x : 0,
		y : 0,
      width: 400,
      maxWidth: 400,
      minWidth: 400,
	  maxHeight: 600,
      minHeight: 600,
      height: 650,
	  center:true,
	  frame: false,
      title: app.getName(),
      webPreferences: {
        nodeIntegration: true
      },
	  show: false
    }

    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/images/logo.png')
    }

    mainWindow = new BrowserWindow(windowOptions)
    mainWindow.center();
    mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))
	
mainWindow.webContents.on('did-finish-load', () => {
  /// then close the loading screen window and show the main window
  if (loadingScreen) {
    loadingScreen.close();
  }
  mainWindow.show();

});
	
    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      mainWindow.webContents.openDevTools()
      mainWindow.maximize()
      require('devtron').install()
    }

    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }

  app.on('ready', () => {
	  createLoadingScreen();
    //createWindow()
	setTimeout(() => {
    createWindow();
  }, 10000);
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
	  createLoadingScreen();
    if (mainWindow === null) {
		createLoadingScreen();
      //createWindow()
    }
  })
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance () {
  if (process.mas) return

  app.requestSingleInstanceLock()

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// Require each JS file in the main-process dir
function loadDemos () {
  const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
  files.forEach((file) => { require(file) })
}

initialize()
