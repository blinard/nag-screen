import * as WebSocket from "ws";
import * as http from "http";
import * as https from "https";
import { ClientRepository } from "./repositories/clientRepository";
import { RegistrationNotificationMessage } from "./core-models/Messages";
import { Client } from "./models/client";
import { ServerMessageHandler } from "./serverMessageHandler";
import { SocketMonitorRepository } from "./repositories/socketMonitorRepository";

interface PushMessageOptions {
    excludedSockets: Array<WebSocket>;
}

export default class WebSocketServer {
    private static server: WebSocket.Server;
    private static clientRepository = new ClientRepository();
    private static messageHandler = new ServerMessageHandler();
    private static monitorRepository = new SocketMonitorRepository();

    public static main(httpServer?: http.Server | https.Server): void {
        let port = process.env.PORT || 3000;
        WebSocketServer.server = new WebSocket.Server(<WebSocket.ServerOptions>{ port: port, server: httpServer });
        WebSocketServer.server.on("connection", WebSocketServer.onServerConnection);
    }

    private static onServerConnection(socket: WebSocket): void {
        var client = WebSocketServer.clientRepository.createClient(socket)
        console.log(new Date().toLocaleString() + " - Client connected: " + client.clientId);

        client.socket.on("message", (jsonMessage: string) => {
            client.lastTrafficTime = new Date();
            console.log(new Date().toLocaleString() + " - Message received: " + jsonMessage);
            WebSocketServer.messageHandler.handleMessage(client, jsonMessage, WebSocketServer.clientRepository);
        });

        let socketMonitor = WebSocketServer.monitorRepository.createMonitor(client.socket, client);
        socketMonitor.onDead = (monitor, socket) => {
            WebSocketServer.clientRepository.removeClientWithSocket(socket);
            WebSocketServer.monitorRepository.removeMonitor(monitor);
        };

        setTimeout(() => {
            var regMessage = new RegistrationNotificationMessage(client.clientId);
            var regMessageString = JSON.stringify(regMessage);
            console.log(new Date().toLocaleString() + " - Sending message: " + regMessageString);
            client.socket.send(regMessageString);
        }, 5000);
    }
}