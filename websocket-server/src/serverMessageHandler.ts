import { Client } from "./models/client";
import { ClientRepository } from "./repositories/clientRepository";
import { Message, ActionType, MessageWithContent } from "./core-models/MessageCore";
import { FriendlyNameContent, PresentNagScreenContent } from "./core-models/MessageContentTypes";
import { EnumerateClientsResponseMessage } from "./core-models/Messages";

export class ServerMessageHandler {
    constructor() {}

    handleMessage(fromClient: Client, jsonMessage: string, clientRepo: ClientRepository): void {
        let coreMessage = <Message>JSON.parse(jsonMessage);
        switch(coreMessage.actionType) {
            case ActionType.PublishFriendlyName:
                let friendlyNameMessage = <MessageWithContent<FriendlyNameContent>>coreMessage;
                fromClient.friendlyName = friendlyNameMessage.content.friendlyName;
                break;
            case ActionType.EnumerateClientsRequest:
                let clientsResponse = new EnumerateClientsResponseMessage(
                    clientRepo.getClients().map((client) => { return { clientId: client.clientId, friendlyName: client.friendlyName } })
                );
                fromClient.socket.send(JSON.stringify(clientsResponse));
                break;
            case ActionType.PresentNagScreen:
                let presentNagMessage = <MessageWithContent<PresentNagScreenContent>>coreMessage;
                let targetClient = clientRepo.getClients()
                    .find((client) => { return client.clientId === presentNagMessage.content.targetClient.clientId});
                if (!targetClient) { return; }
                targetClient.socket.send(JSON.stringify(presentNagMessage));
                break;
        }
    }
}