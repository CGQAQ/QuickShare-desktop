import { BrowserWindow, ipcMain, ipcRenderer, WebContents } from "electron";
import Express from "express";
import { Server } from "ws";
import { networkInterfaces } from "os";
import { HTTPCreatedPayload, IPCChannels, QSEvent } from "./types";
import { Subject } from "rxjs";
import * as os from "os";
import { resolve } from "path";

function onReady(web: WebContents, cb: (web: WebContents) => void) {
  web.on("did-finish-load", () => {
    cb(web);
  });
}

function getLocalAddr(): Record<string, string> {
  const nets = networkInterfaces();
  const results = Object.create(null); // Or just '{}', an empty object

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === "IPv4" && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }
  return results;
}

function initHttpServer(web: WebContents) {
  const express = Express();
  express.get("/gateway", (req, res) => {
    console.log(req.query);
    if (req.query.device && req.query.device === "app") {
      // APP: just give the websocket server addr
    } else {
      // Others: treat as browser, give back webpage
      res.write("hello world" + JSON.stringify(req.query));
    }
    res.end();
  });
  express.listen(59230, "0.0.0.0", () => {
    const addr = getLocalAddr();
    onReady(web, (web) => {
      web.send(IPCChannels.IPCHTTPCreated, {
        addr: `http://${Object.values(addr)[0][0]}:59230/gateway?a=1&b=2`,
      } as HTTPCreatedPayload);
    });
  });
}

export const hub = new Subject<QSEvent>();

function initServer() {
  const server = new Server({
    port: 59229,
  });
  server.on("connection", function (socket) {
    // connected! blur the qrcode
    hub.next({ type: "connected" });
    socket.on("message", (data: string) => {
      try {
        const ev: QSEvent = JSON.parse(data);
        if (ev.type) {
          if (ev.type === "confirm") {
            // close the qrcode page
            hub.next({ type: "confirm" });
          } else if (ev.type === "message") {
            // send message to renderer directly
            hub.next({ type: "message", payload: ev.payload });
          } else if (ev.type === "file") {
            // file is encoded in base64 to transfer? maybe decode now?
            hub.next({ type: "file", payload: ev.payload });
          }
        }
      } catch (_) {}
    });
  });
}

export function getDefaultDir(web: WebContents) {
  web.send(IPCChannels.IPCHomeDir, resolve(os.homedir(), "Downloads"));
}

export function start(mainWindow: BrowserWindow) {
  initServer();
  initHttpServer(mainWindow.webContents);
  getDefaultDir(mainWindow.webContents);
}
