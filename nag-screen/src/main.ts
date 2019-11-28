import {BrowserWindow, App} from "electron";
import * as path from "path";
import * as url from "url";
import { ClientMessageHandler } from "./clientMessageHandler";
import * as WebSocket from "ws";
import { SocketMonitor } from "./core-models/SocketMonitor";

export default class Main {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  static mainWindow: BrowserWindow;
  static application: App;
  static BrowserWindow: any;
  static messageHandler = new ClientMessageHandler();
  // serverSocket: WebSocket;
  // socketMonitor: SocketMonitor;

  static main(app: App, browserWindow: typeof BrowserWindow): void {
    Main.application = app;
    Main.BrowserWindow = browserWindow;

    Main.application.on("ready", Main.onAppReady);
    Main.application.on("window-all-closed", Main.onAppWindowAllClosed);
    Main.application.on("activate", Main.onAppActivate);

    Main.createAndConnectSocket();
  }

  private static createAndConnectSocket(): void {
    let serverSocket = new WebSocket("ws://192.168.1.129:3000");
    
    let socketMonitor = new SocketMonitor(serverSocket);
    socketMonitor.onDead = () => { Main.createAndConnectSocket(); };

    serverSocket.on("message", (message) => { 
      Main.messageHandler.handleMessage(serverSocket, message.toString(), Main.mainWindow);
    });
    serverSocket.on("error", (err) => { 
      console.log(err); 
    });
  }

  private static createWindow(): void {
    // Create the browser window.
    Main.mainWindow = new Main.BrowserWindow({
      width: 800, 
      height: 600,
      show: false,
      resizeable: false,
      closable: false,
      alwaysOnTop: true,
      fullscreen: true,
      skipTaskbar: true,
      frame: false
    });
  
    // and load the index.html of the app.
    Main.mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
  
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
  
    Main.mainWindow.on("close", Main.onWindowClose);
  }

  private static onWindowClose(): void {
    Main.mainWindow = null;
  }

  private static onAppReady(): void {
    Main.createWindow();
  }

  private static onAppActivate(): void {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (Main.mainWindow === null) {
      Main.createWindow();
    }
  }

  private static onAppWindowAllClosed(): void {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      Main.application.quit();
    }
  }
}
