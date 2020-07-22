export class ChatMessageModel {
    Id: number;
    ChatId: number;
    UserId: number;
    UserName: string;
    UserFullName: string;
    receiverUserName;
    Message: string;
    MessageDateTime: Date;
    IsRead: boolean;
    ReadDateTime: Date;
}