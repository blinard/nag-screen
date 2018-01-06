import * as WebSocket from "ws";
import * as Core from "../core-models/Client";

export interface Client extends Core.Client {
    socket: WebSocket
}