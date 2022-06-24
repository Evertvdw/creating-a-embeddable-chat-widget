export interface AddClient {
    name: string;
}
export interface Client extends AddClient {
    id: string;
    connected: boolean;
    typing: string;
    messages: Message[];
}
export interface Admin {
    name: string;
    email: string;
    hash: string;
    connected?: boolean;
}
export declare enum MessageType {
    Admin = "admin",
    Client = "client",
    Info = "info"
}
export interface Message {
    time: number;
    message: string;
    adminName?: Admin['name'];
    type: MessageType;
}
//# sourceMappingURL=index.d.ts.map