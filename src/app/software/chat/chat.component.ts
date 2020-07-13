import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ToastController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ObservableArray } from 'wijmo/wijmo';
import { ProfilePage } from '../profile/profile.page';
import { ChatGroupPage } from '../chat-group/chat-group.page';
import { Storage } from '@ionic/storage';
import { ChatBoxComponent } from '../chat-box/chat-box.component';
import { ChatService } from './chat.service';
import { ChatUserListComponent } from '../chat-user-list/chat-user-list.component';

export interface activeChat {
  Id: string;
  User: string;
  IsRoom: boolean;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {


  constructor(
    private socket: Socket,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private storage: Storage,
    private chatService: ChatService
  ) {
  }

  private socketId: string = '';
  private currentUser: string = '';

  private activeChat: activeChat[] = [];

  private isActiveChat: boolean = false;
  private isChatBoxOpen: boolean = false;
  private usernameToWhomChatBoxOpen: string = '';

  private chatListSubcription: any;
  private username: any;

  private ListChatObservableArrayChat = new ObservableArray();

  private async getChatList() {
    this.chatListSubcription = await (await this.chatService.ListChat()).subscribe(data => {
      let listChatObservableArray = new ObservableArray();
      var results = data;
      if (results["length"] > 0) {
        for (var i = 0; i <= results["length"] - 1; i++) {
          listChatObservableArray.push({
            Id: results[i].Id,
            ChatDate: results[i].ChatDate,
            ChatName: results[i].ChatName,
            ReceiverId: results[i].ReceiverId,
            ReceiverUserName: results[i].ReceiverUserName,
            CreatedByUserId: results[i].CreatedByUserId,
            CreatedByUserFullName: results[i].CreatedByUserFullName,
          });
        }

        this.ListChatObservableArrayChat = listChatObservableArray;
        if (this.chatListSubcription != null) this.chatListSubcription.unsubscribe();

      }
    });
  }

  async getUserName() {
    try { return await this.storage.get("username") }
    catch (e) { console.log(e) }
  }

  ngOnInit() {
    this.socket.connect();
    this.getUserName().then((res: any) => {
      this.username = res;
      this.socket.emit('set-username', { userName: res });
    })

    this.getChatList();

    this.socket.fromEvent('users-list').subscribe((data: any) => {
      console.log('activeChat from socket: ', data);
      let connectionObservableArray: ObservableArray = new ObservableArray();
      this.activeChat = [];
      if (data.clients["length"] > 0) {
        for (var i = 0; i <= data.clients["length"] - 1; i++) {
          if (data.clients[i].username !== undefined && data.clients[i].username !== '') {
            connectionObservableArray.push({ Id: data.clients[i].id, User: data.clients[i].username, IsRoom: data.clients[i].isRoom });
          }
        }
      }
      setTimeout(() => {
        this.activeChat = connectionObservableArray;
      }, 500);
      console.log('activeChat: ', this.activeChat);
    });

    this.socket.fromEvent('broadcast-new-client-connnected').subscribe((data: any) => {
      console.log('New client connected: ', data);
      this.activeChat.push({ Id: data.id, User: data.username, IsRoom: data.isRoom });
    });


    this.socket.fromEvent('message-notification').subscribe((message: any) => {
      if (!this.isChatBoxOpen) {
        // this.getNoOfUnreadMessages(message.senderId);
      }

      if (this.isChatBoxOpen === true && message.sender !== this.usernameToWhomChatBoxOpen) {
        // this.getNoOfUnreadMessages(message.senderId);
      }
    });

  }

  async showProfileModal() {
    let modal = await this.modalCtrl.create({
      component: ProfilePage,
      componentProps: {
        Id: this.socketId,
        currentUser: this.currentUser,
      },
      cssClass: "modal-fullscreen"
    });

    await modal.present();
    await modal.onDidDismiss();
  }

  async showChatGroupModal() {
    let modal = await this.modalCtrl.create({
      component: ChatGroupPage,
      componentProps: {
        userId: this.socketId,
        currentUser: this.currentUser,
      },
      cssClass: "modal-fullscreen"
    });

    await modal.present();
    await modal.onDidDismiss();
  }


  async showChatBoxModal(chatId, receiverId, receiverUserName, chatName) {
    this.usernameToWhomChatBoxOpen = receiverUserName;
    this.isChatBoxOpen = true;

    let modal = await this.modalCtrl.create({
      component: ChatBoxComponent,
      componentProps: {
        chatId: chatId,
        receiverId: receiverId,
        receiverUserName: receiverUserName,
        receiverFullName: chatName,
        username: this.username,
      }, cssClass: "modal-fullscreen"
    });

    await modal.present();
    await modal.onDidDismiss().then(() => {
      this.isChatBoxOpen = false;
    });
  }

  async showUserListBoxModal() {
    let modal = await this.modalCtrl.create({
      component: ChatUserListComponent,
      componentProps: {
        currentUserName: this.username,
      }, cssClass: "modal-fullscreen"
    });

    await modal.present();
    await modal.onDidDismiss();
  }

  private readReceiveMessages(senderId) {
    for (var i = 0; i <= this.activeChat["length"] - 1; i++) {
      if (this.activeChat[i].Id === senderId) {
        // console.log('Number of unread messages: ', this.activeChat[i].NoOfUnreadReceivedMessages);
      }
    }
  }

  ionViewDidLeave() {
    if (this.chatListSubcription != null) this.chatListSubcription.unsubscribe();
    this.socket.removeAllListeners('users-list');
    this.socket.removeAllListeners('broadcast-new-client-connnected');
    this.socket.removeAllListeners('message-notification');

  }
}
