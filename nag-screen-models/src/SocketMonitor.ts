import * as WebSocket from "ws";
import {Client} from "./Client";

export interface OnDeadFunction {
    (socketMonitor: SocketMonitor, deadSocket: WebSocket): void;
}

export class SocketMonitor {
    private readonly HealthCheckSeconds = 30;
    private isAlive = true;
    private healthCheckInterval: NodeJS.Timer;
    
    constructor(private socket: WebSocket, private client?: Client) { 
        //Presence of client means that we're doing server-style liveliness checking
        if (!!this.client) {
            this.client.lastTrafficTime = new Date();
            this.socket.on("ping", () => { if (!!this.client) { this.client.lastTrafficTime = new Date(); } });
            this.healthCheckInterval = setInterval(() => { this.checkForLiveliness(); }, (this.HealthCheckSeconds * 2) * 1000);
            return;
        }

        this.socket.on("pong", () => { this.setIsAlive() });
        this.healthCheckInterval = setInterval(() => { this.checkForLiveliness(); }, this.HealthCheckSeconds * 1000);
    }

    private setIsAlive() {
        this.isAlive = true;
    }

    private checkForLiveliness() {
        //Presence of client means that we're doing server-style liveliness checking
        if (!!this.client) {
            let msSinceLastPing = Math.abs(new Date().valueOf() - (this.client && this.client.lastTrafficTime && this.client.lastTrafficTime.valueOf() || 0));
            if (msSinceLastPing <= (this.HealthCheckSeconds * 2) * 1000) return;
            clearInterval(this.healthCheckInterval);
            this.socket.terminate();
            if (!!this.onDead) this.onDead(this, this.socket);
            return;
        }

        //Doing normal client-side liveliness check
        if (!this.isAlive) {
            clearInterval(this.healthCheckInterval);
            this.socket.terminate();
            if (!!this.onDead) this.onDead(this, this.socket);
            return;
        }

        this.isAlive = false;
        this.socket.ping("", false, true);
    }

    public onDead?: OnDeadFunction;
}