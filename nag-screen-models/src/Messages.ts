
import { ActionType, Message, MessageWithContent } from "./MessageCore";
import { RegistrationContent, FriendlyNameContent, EnumerateClientsResponseContent, PresentNagScreenContent } from "./MessageContentTypes";
import { Client } from "./Client";

export class RegistrationNotificationMessage implements MessageWithContent<RegistrationContent> {
    actionType: ActionType = ActionType.RegistrationNotification;
    content: RegistrationContent;

    constructor(clientId: string) {
        this.content = { clientId: clientId };
    }
}

export class PublishFriendlyNameMessage implements MessageWithContent<FriendlyNameContent> {
    actionType: ActionType = ActionType.PublishFriendlyName;
    content: FriendlyNameContent;
    
    constructor(clientId: string, friendlyName: string) {
        this.content = { clientId: clientId, friendlyName: friendlyName };
    }
}

export class EnumerateClientsRequestMessage implements Message {
    actionType: ActionType = ActionType.EnumerateClientsRequest;
    
    constructor() {}
}

export class EnumerateClientsResponseMessage implements MessageWithContent<EnumerateClientsResponseContent> {
    actionType: ActionType = ActionType.EnumerateClientsResponse;
    content: EnumerateClientsResponseContent;
    
    constructor(clients: Array<Client>) {
        this.content = { clients: clients };
    }
}

export class PresentNagScreenMessage implements MessageWithContent<PresentNagScreenContent> {
    actionType: ActionType = ActionType.PresentNagScreen;
    content: PresentNagScreenContent;
    
    constructor(targetClient: Client, displaySeconds: number, message: string) {
        this.content = { targetClient: targetClient, displaySeconds: displaySeconds, message: message };
    }
}