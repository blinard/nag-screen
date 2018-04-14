import * as WebSocket from "ws";
import * as os from "os";
import { Message, ActionType, MessageWithContent } from "./core-models/MessageCore";
import { RegistrationContent, PresentNagScreenContent } from "./core-models/MessageContentTypes";
import { PublishFriendlyNameMessage } from "./core-models/Messages";
import { BrowserWindow } from "electron";

export class ClientMessageHandler {
    constructor() {}

    handleMessage(serverSocket: WebSocket, jsonMessage: string, mainWindow: BrowserWindow): void {
        let genericMessage = <Message>JSON.parse(jsonMessage);
        switch(genericMessage.actionType) {
            case ActionType.RegistrationNotification:
                let regNotificationMessage = <MessageWithContent<RegistrationContent>>genericMessage;
                let friendlyNameMessage = new PublishFriendlyNameMessage(
                    regNotificationMessage.content.clientId,
                    os.hostname()
                );
                serverSocket.send(JSON.stringify(friendlyNameMessage));
                break;
            case ActionType.PresentNagScreen:
                let nagScreenMessage = <MessageWithContent<PresentNagScreenContent>>genericMessage;
                //nagScreenMessage.content.message
                for (let i = 0; i < nagScreenMessage.content.displaySeconds; i++) {
                    setTimeout(() => {
                        mainWindow.show();
                    }, i * 1000);
                }
                setTimeout(() => {
                    mainWindow.hide();
                }, nagScreenMessage.content.displaySeconds * 1000);
                break;
        }
    }
}