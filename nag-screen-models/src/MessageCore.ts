export enum ActionType {
    RegistrationNotification,
    PublishFriendlyName,
    PresentNagScreen,
    EnumerateClientsRequest,
    EnumerateClientsResponse
}

export interface Message {
    actionType: ActionType;
}

export interface MessageWithContent<TContentType> extends Message {
    content: TContentType;
}