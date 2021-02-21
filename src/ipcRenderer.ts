import { ipcMain, ipcRenderer } from "electron";
import { Observable, Subject } from "rxjs";
import { IPCChannels, HTTPCreatedPayload, QSEvent } from "./types";

export const httpServerCreatedObserverable = new Observable((sub) => {
  ipcRenderer.on(
    IPCChannels.IPCHTTPCreated,
    (_, payload: HTTPCreatedPayload) => {
      sub.next(payload);
    }
  );
});

export const evHub = new Subject<QSEvent>();

export function start() {
  ipcRenderer.on(IPCChannels.IPCHomeDir, (ev, path: string) => {
    evHub.next({ type: "defaultPath", payload: path });
  });
}
