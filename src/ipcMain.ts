import { ipcMain, ipcRenderer } from "electron";
import Express from "express";
import { Server } from "ws";
import { networkInterfaces } from "os";
import { HTTPCreatedPayload, IPCChannels } from "./types";

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

function initHttpServer() {
  const express = Express();
  express.get("/gateway", (req, res) => {
    console.log(req.query);
    res.write("hello world");
  });
  express.listen(59230, "0.0.0.0", () => {
    const addr = getLocalAddr();
    ipcMain.emit(IPCChannels.IPCHTTPCreated, {
      addr: Object.values(addr)[0][0],
    } as HTTPCreatedPayload);
  });
}

export function start() {
  let server: Server;
  function initServer() {
    // server = new Server({
    //   port: 59229,
    // });
    // server.on("connection", function (socket) {
    //   socket.on();
    // });
  }

  initHttpServer();
}
