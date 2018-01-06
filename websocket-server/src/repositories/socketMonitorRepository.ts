import * as WebSocket from "ws";
import * as uuid from "uuid";
import { Client } from "../models/client";
import { SocketMonitor } from "../core-models/SocketMonitor";

export class SocketMonitorRepository {
    private monitors = new Array<SocketMonitor>();
    constructor() {}

    createMonitor(socket: WebSocket, client: Client): SocketMonitor {
        let newMonitor = new SocketMonitor(socket, client);
        this.monitors.push(newMonitor);
        return newMonitor;
    }

    removeMonitor(monitorToRemove: SocketMonitor): void {
        this.monitors = this.monitors.filter((monitor) => monitor !== monitorToRemove);
    }
}