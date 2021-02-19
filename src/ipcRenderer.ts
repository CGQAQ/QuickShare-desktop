import { ipcRenderer } from "electron";
import { IPCChannels, HTTPCreatedPayload } from "./types";

export function start() {
  function* httpCreated() {
    let result: HTTPCreatedPayload = null;
    ipcRenderer.on(
      IPCChannels.IPCHTTPCreated,
      (ev, payload: HTTPCreatedPayload) => {
        result = payload;
      }
    );
  }
}
