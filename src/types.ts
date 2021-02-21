export const IPCChannels = {
  IPCHTTPCreated: "ipc_http_created",
  IPCHomeDir: "ipc_home_dir",
};

export interface HTTPCreatedPayload {
  addr: string;
}

export interface QSEvent {
  type: "connected" | "confirm" | "message" | "file" | "defaultPath";
  payload?: string;
}
