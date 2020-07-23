export class ChatMessageModel {
    Id: number;
    ChatId: number;
    SenderUserName: string;
    SenderFullName: string;
    RecieverId: number;
    ReceiverUserName;
    Message: string;
    MessageDateTime: Date;
    IsRead: boolean;
    ReadDateTime: Date;
}