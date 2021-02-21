import { ipcRenderer } from "electron";
import { Observable } from "rxjs";
import { IPCChannels, HTTPCreatedPayload } from "./types";

export const httpServerCreatedObserverable = new Observable((sub) => {
  ipcRenderer.on(
    IPCChannels.IPCHTTPCreated,
    (_, payload: HTTPCreatedPayload) => {
      sub.next(payload);
    }
  );
});

export function start() {}
