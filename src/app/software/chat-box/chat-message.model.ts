export class ChatMessageModel {
    Id: number;
    ChatId: number;
    UserId: number;
    senderUserName: string;
    receiverUserName;
    Message: string;
    MessageDateTime: Date;
    IsRead: boolean;
    ReadDateTime: Date;
}