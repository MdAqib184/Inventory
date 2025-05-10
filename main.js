const { app, BrowserWindow } = require("electron");
const path = require("path");
const { fork } = require("child_process");

let mainWindow;
let serverProcess;

// Start backend server
function startBackendServer() {
  const serverPath = path.join(__dirname, "server", "index.js"); // Ensure correct path to your server entry file
  serverProcess = fork(serverPath);

  // Handle server messages if needed
  serverProcess.on("message", (message) => {
    console.log("Message from server:", message);
  });
}

app.on("ready", () => {
  // Start the backend server
  startBackendServer();

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the React app from the build directory
  mainWindow.loadFile(path.join(__dirname, "client", "build", "index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("quit", () => {
  // Kill the server process when the app quits
  if (serverProcess) {
    serverProcess.kill();
  }
});
