import * as WebSocket from "ws";
import * as uuid from "uuid";
import { Client } from "../models/client";

export class ClientRepository {
    private clients = new Array<Client>();
    constructor() {}

    createClient(socket: WebSocket): Client {
        let client: Client = {
            clientId: uuid(),
            socket: socket            
        };

        this.clients.push(client);
        return client;
    }

    getClients(): Array<Client> {
        return this.clients;
    }

    removeClientWithSocket(socketToRemove: WebSocket): void {
        var clientToRemove = this.clients.find((client) => client.socket === socketToRemove);
        if (!!clientToRemove) 
            console.log(new Date().toLocaleString() + " - Removing client: " + JSON.stringify({ clientId: clientToRemove.clientId, friendlyName: clientToRemove.friendlyName, lastTrafficTime: clientToRemove.lastTrafficTime }));
        
        this.clients = this.clients.filter((client) => client.socket !== socketToRemove);
    }
}