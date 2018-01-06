import {Client} from "./Client";

export interface RegistrationContent {
    clientId: string;
}

export interface FriendlyNameContent {
    clientId: string;
    friendlyName: string;
}

export interface EnumerateClientsResponseContent {
    clients: Array<Client>;
}

export interface PresentNagScreenContent {
    targetClient: Client,
    displaySeconds: number,
    message: string
}