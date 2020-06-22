import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ToastController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ObservableArray } from 'wijmo/wijmo';
import { ChatBoxPage } from '../chat-box/chat-box.page';
import { ProfilePage } from '../profile/profile.page';
import { ChatGroupPage } from '../chat-group/chat-group.page';

export interface activeUsers {
  Id: string;
  User: string;
  IsRoom: boolean;
}


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  constructor(
    private socket: Socket,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
  ) {
  }

  private socketId: string = '';
  private currentUser: string = '';

  private activeUsers: activeUsers[] = [];

  private isActiveChat: boolean = false;
  private isChatBoxOpen: boolean = false;
  private usernameToWhomChatBoxOpen: string = '';


  ngOnInit() {
    this.socket.connect();

    this.socket.fromEvent('user-detail-return').subscribe((data: any) => {
      this.socketId = data.id;
      console.log('Socket id: ', this.socketId);
    });

    this.socket.fromEvent('users-list').subscribe((data: any) => {

      console.log('activeUsers from socket: ', data);

      let connectionObservableArray: ObservableArray = new ObservableArray();

      this.activeUsers = [];

      if (data.clients["length"] > 0) {
        for (var i = 0; i <= data.clients["length"] - 1; i++) {
          if (data.clients[i].username !== undefined && data.clients[i].username !== '') {
            connectionObservableArray.push({ Id: data.clients[i].id, User: data.clients[i].username, IsRoom: data.clients[i].isRoom });
          }
        }
      }
      this.activeUsers = connectionObservableArray;
      console.log('activeUsers: ', connectionObservableArray);
    });

    this.socket.fromEvent('broadcast-new-client-connnected').subscribe((data: any) => {
      console.log('New client connected: ', data);
      this.activeUsers.push({ Id: data.id, User: data.username, IsRoom: data.isRoom });
    });

    this.socket.fromEvent('room-created').subscribe((data: any) => {
      console.log('New client connected: ', data);
      this.activeUsers.push({ Id: data.id, User: data.username, IsRoom: data.isRoom });
    });

    this.socket.fromEvent('set-name-response').subscribe((response: any) => {
      console.log(response.error);
      if (response.error) {
        this.showToastSetNameError(response.responseMessage);
      } else {
        this.isActiveChat = true;
      }
    });

    this.socket.fromEvent('message-notification').subscribe((message: any) => {
      if (!this.isChatBoxOpen) {
        this.getNoOfUnreadMessages(message.senderId);
      }

      if (this.isChatBoxOpen === true && message.sender !== this.usernameToWhomChatBoxOpen) {
        this.getNoOfUnreadMessages(message.senderId);
      }
    });

  }

  addSocket() {
    let user;
    this.socket.emit('set-name', { User: user});
  }

  // Open Profile
  async showProfileModal() {
    let modal = await this.modalCtrl.create({
      component: ProfilePage,
      componentProps: {
        Id: this.socketId,
        currentUser: this.currentUser,
      },
      cssClass: "modal-fullscreen"
    })
    await modal.present();
    await modal.onDidDismiss().then(() => {
    });
  }

  async showChatGroupModal() {
    let modal = await this.modalCtrl.create({
      component: ChatGroupPage,
      componentProps: {
        userId: this.socketId,
        currentUser: this.currentUser,
      },
      cssClass: "modal-fullscreen"
    })
    await modal.present();
    await modal.onDidDismiss().then(() => {
    });
  }

  // Open Chat Box
  async showChatBoxModal(userId, userName, isRoom) {
    this.usernameToWhomChatBoxOpen = userName;
    this.isChatBoxOpen = true;
    let collectionId = userId + this.socketId;

    this.readReceiveMessages(userId);

    let modal = await this.modalCtrl.create({
      component: ChatBoxPage,
      componentProps: {
        receiverId: userId,
        receiver: userName,
        currentUser: this.currentUser,
        messageCollectionId: collectionId,
        isRoom: isRoom
      }, cssClass: "modal-fullscreen"
    });

    await modal.present();
    await modal.onDidDismiss().then(() => {
      this.isChatBoxOpen = false;
    });
  }

  private readReceiveMessages(senderId) {
    for (var i = 0; i <= this.activeUsers["length"] - 1; i++) {
      if (this.activeUsers[i].Id === senderId) {
        // console.log('Number of unread messages: ', this.activeUsers[i].NoOfUnreadReceivedMessages);
      }
    }
  }

  async showToastSetNameError(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000,
      color: "danger"
    });
    toast.present();
  }

  private getNoOfUnreadMessages(senderId) {
    for (var i = 0; i <= this.activeUsers["length"] - 1; i++) {
      if (this.activeUsers[i].Id === senderId) {
        // this.activeUsers[i].NoOfUnreadReceivedMessages = ++this.activeUsers[i].NoOfUnreadReceivedMessages;
        // console.log('Number of unread messages: ', this.activeUsers[i].NoOfUnreadReceivedMessages);
      }
    }
  }

}
