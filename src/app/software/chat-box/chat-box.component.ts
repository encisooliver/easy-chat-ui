import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ToastController, IonContent } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { ModalController } from '@ionic/angular';
import { Color, ObservableArray } from 'wijmo/wijmo';
import { ChatBoxService } from './chat-box.service';
import { ChatMessageModel } from './chat-message.model';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {

  constructor(private socket: Socket,
    private modalCtrl: ModalController,
    private chatBoxService: ChatBoxService,
    private storage: Storage,
  ) { }

  @Input() username: any;
  @Input() userFullName: any;
  @Input() chatId: any;

  @Input() receiverId: any;
  @Input() receiverFullName: any;
  @Input() receiverUserName: any;

  @Input() isRoom: boolean;
  @ViewChild(IonContent) content: IonContent;

  headerDetail = '';
  message = '';

  isTyping = false;
  isDisabledSms = true;
  isConnected: boolean = true;

  private listMessageSubscription: any;
  private listMessagesObservableArray: ObservableArray = new ObservableArray;

  ngOnInit() {
    this.getMessages();
    console.log("username: ", this.username);
    this.headerDetail = this.receiverFullName;

    this.socket.fromEvent('private message').subscribe((data: any) => {

      if (this.receiverUserName === data.messageObj.senderUserName) {
        // for (var i = 0; i <= this.messages["length"] - 1; i++) {
        //   if (this.messages[i].type === 'typing-event') {
        //     this.messages.splice(this.messages.indexOf(this.messages[i]), 1);
        //   }
        // }

        console.log('New message: ', data.messageObj);
        this.listMessagesObservableArray.push(data.messageObj);

        setTimeout(() => {
          this.content.scrollToBottom(200);
        });
        console.log('New message: ', data.messageObj);
      }
    });

    this.socket.fromEvent('typing-message').subscribe((data: any) => {
      console.log('Typing event', data.typingObj.isTyping);

      if (this.receiverUserName === data.typingObj.senderUserName) {
        console.log('Typing event');
        this.isTyping = data.typingObj.isTyping;
        setTimeout(() => {
          this.content.scrollToBottom(200);
        });
      }
    });

    this.socket.fromEvent('typing-stop').subscribe((data: any) => {
      if (this.receiverUserName === data.typingObj.senderUserName) {
        this.isTyping = data.isTyping;
        setTimeout(() => {
          this.content.scrollToBottom(200);
        });
      }
    });
  }

  private async getMessages() {
    let listMessagesObservableArray: ObservableArray = new ObservableArray;

    this.listMessageSubscription = await (await this.chatBoxService.ListMessage(this.chatId)).subscribe(data => {
      let results = data;
      if (results["length"] > 0) {
        for (var i = 0; i <= results["length"] - 1; i++) {
          listMessagesObservableArray.push({
            Id: results[i].Id,
            ChatId: results[i].ChatId,
            UserFullName: results[i].UserFullName,
            UserName: results[i].UserName,
            Message: results[i].Message,
            MessageDateTime: results[i].MessageDateTime,
            IsRead: results[i].IsRead,
            ReadDateTime: results[i].ReadDateTime,
          });
        }

        this.listMessagesObservableArray = listMessagesObservableArray;
        if (this.listMessageSubscription != null) this.listMessageSubscription.unsubscribe();

        setTimeout(() => {
          this.content.scrollToBottom(200);
        }, 100);
      }
    });
  }


  ionViewWillEnter() {
    this.getFullName()
  }

  async getFullName() {
    try { this.userFullName = await this.storage.get("FullName") }
    catch (e) { console.log(e) }
  }


  private chatMessageModel: ChatMessageModel = {
    Id: 0,
    ChatId: 0,
    UserId: 0,
    UserFullName: '',
    UserName: '',
    receiverUserName: '',
    Message: '',
    MessageDateTime: new Date(),
    IsRead: false,
    ReadDateTime: new Date()
  }

  async close() {
    await this.modalCtrl.dismiss();
    if (this.isRoom == true) {
      // this.socket.emit('leave', { room: this.receiverId });
    }
  }

  private sentMessageSubSubscription: any;

  private async sendMessage() {
    this.chatMessageModel.ChatId = this.chatId;
    this.chatMessageModel.UserName = this.username;
    this.chatMessageModel.UserFullName = this.userFullName;
    this.chatMessageModel.UserId = this.receiverId;
    this.chatMessageModel.receiverUserName = this.receiverUserName;
    this.chatMessageModel.Message = this.messageContentAchorTag(this.message);
    this.chatMessageModel.MessageDateTime = new Date();

    if (this.receiverId == 0) {
      this.sentMessageSubSubscription = await (await this.chatBoxService.SendRoomMessage(this.chatId, this.chatMessageModel)).subscribe(
        response => {
          this.pushMessageToChatBox();
          if (this.sentMessageSubSubscription != null) this.sentMessageSubSubscription.unsubscribe();
        },
        error => {
          console.log(error.status);
          this.isConnected = false;
        }
      );
    }
    else {
      this.sentMessageSubSubscription = await (await this.chatBoxService.SendPrivateMessage(this.chatId, this.receiverId, this.chatMessageModel)).subscribe(
        response => {
          this.pushMessageToChatBox();
          if (this.sentMessageSubSubscription != null) this.sentMessageSubSubscription.unsubscribe();
        },
        error => {
          console.log(error.status);
          this.isConnected = false;
        }
      );
    }
  }

  private async pushMessageToChatBox() {
    await this.listMessagesObservableArray.push({
      Id: 0,
      ChatId: this.chatId,
      senderUserName: this.chatMessageModel.UserName,
      UserFullName: this.chatMessageModel.UserFullName,
      receiverUserName: this.receiverUserName,
      Message: this.chatMessageModel.Message,
      MessageDateTime: this.chatMessageModel.MessageDateTime,
      IsRead: false,
      ReadDateTime: new Date()
    });

    await this.socket.emit('private-message', { messageObj: this.chatMessageModel });

    setTimeout(() => {
      this.content.scrollToBottom(200);
    }, 100);

    this.message = '';
    this.isDisabledSms = true;
  }


  public messageTextAreaKeyPress(event: any) {

    let checkMessage = this.message;
    if (!checkMessage.replace(/\s/g, '').length) {
      console.log("Key press: ", checkMessage.replace(/\s/g, '').length);
      this.isDisabledSms = true;
    } else {
      this.isDisabledSms = false;
    }

    // console.log("Key press: ", checkMessage.replace(/\s/g, '').length);

    // this.socket.emit('user typing', { senderUserName: this.username, receiverUserName: this.receiverUserName, isTyping: true });

    // setTimeout(() => {
    //   // this.socket.emit('user stop typing', { senderUserName: this.username, receiverUserName: this.receiverUserName, isTyping: false });
    // }, 3000);
  }

  messageContentAchorTag(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp, "<a style='color:white;' href='$1'  target='_self'>$1</a> ");
  }

  checkText(text) {
    var exp = "((ht|f)tp(s?))(:((\/\/)(?!\/)))(((w){3}\.)?)([a-zA-Z0-9\-_]+(\.(com|edu|gov|int|mil|net|org|biz|info|name|pro|museum|co\.uk)))(\/(?!\/))(([a-zA-Z0-9\-_\/]*)?)([a-zA-Z0-9])+\.((jpg|jpeg|gif|png)(?!(\w|\W)))";
    return text.match(exp);
  }

  ionViewDidLeave() {
    if (this.listMessageSubscription != null) this.listMessageSubscription.unsubscribe();
    if (this.sentMessageSubSubscription != null) this.sentMessageSubSubscription.unsubscribe();

    this.socket.removeAllListeners('message-inbox');
    this.socket.removeAllListeners('private message');
    this.socket.removeAllListeners('typing-message');
    this.socket.removeAllListeners('participate-room-chat');
    this.socket.removeAllListeners('left-room');
    this.socket.removeAllListeners('message-room');
  }
}
