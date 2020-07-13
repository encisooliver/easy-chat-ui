import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ToastController, ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ObservableArray } from 'wijmo/wijmo';
import { StorageService, User } from '../ionic-storage-service/storage.service';
import { ChatRoomPage } from '../chat-room/chat-room.page';
import { ProfilePage } from '../profile/profile.page';
import { RoomPage } from '../room/room.page';

export interface ModalOptions {
  showBackdrop?: boolean;
  enableBackdropDismiss?: boolean;
  enterAnimation?: string;
  leaveAnimation?: string;
  cssClass?: string;
}

export interface UserChat {
  Id: string;
  User: string;
  UIId: string;
  NoOfUnreadReceivedMessages: number;
  IsRoom: boolean;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {


  public userObservableArray: ObservableArray = new ObservableArray();
  public subUser: any;

  isValid = true;

  private connections: UserChat[] = [];
  private objUser: User;

  private socketDetail: any;

  private privateprivateprivateMsg = [];

  private isfromChat = false;
  private isActiveChat = false;

  private socketId = '';
  private user: '';
  private currentUser = '';
  private currentUserUIId = '';
  private usernameToWhomChatBoxOpen = '';

  private modal: any = null;
  messages = [];
  message = '';
  noOfMessages = 0;
  isChatBoxOpen = false;

  constructor(
    private socket: Socket,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
  ) {
  }

  async showChatModal(userId, userName, isRoom) {
    this.usernameToWhomChatBoxOpen = userName;
    this.isChatBoxOpen = true;
    let collectionId = userId + this.socketId;

    this.readReceiveMessages(userId);

    let modal = await this.modalCtrl.create({
      component: ChatRoomPage,
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
      this.noOfMessages = 0;
    });
  }

  async showRoomModal() {
    let modal = await this.modalCtrl.create({
      component: RoomPage,
      componentProps: {
        userId: this.socketId,
        currentUser: this.currentUser,
        currentUserUIId: this.currentUserUIId
      },
      cssClass: "modal-fullscreen"
    })
    await modal.present();
    await modal.onDidDismiss().then(() => {
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
    })
    await modal.present();
    await modal.onDidDismiss().then(() => {
    });
  }

  addSocket() {
    this.currentUser = this.user;
    this.currentUserUIId = this.user + `${new Date().getTime()}`;
    this.connections = null;
    this.socket.emit('set-name', { User: this.user, UIId: this.currentUserUIId });
    console.log("FIRE!");
  }

  ngOnInit() {
    this.socket.connect();

    this.socket.fromEvent('user-detail-return').subscribe((data: any) => {
      this.socketId = data.id;
      console.log('Socket id: ', this.socketId);
      this.addToStorage(data);
    });

    this.socket.fromEvent('user-disconnected').subscribe((data: any) => {
      console.log('new connection: ', data);
      for (var i = 0; i <= this.connections["length"] - 1; i++) {
        if (this.connections[i].Id === data.userId) {
          this.connections.splice(this.connections.indexOf(this.connections[i]), 1);
          break;
        }
      }
    });

    this.socket.fromEvent('users-list').subscribe((data: any) => {
      console.log('Connections from socket: ', data);
      let connectionObservableArray: ObservableArray = new ObservableArray();
      this.connections = [];

      if (data.clients["length"] > 0) {
        for (var i = 0; i <= data.clients["length"] - 1; i++) {
          if (data.clients[i].username !== undefined && data.clients[i].username !== '' && data.clients[i].uiid !== this.currentUserUIId) {
            connectionObservableArray.push({ Id: data.clients[i].id, User: data.clients[i].username, UIId: data.clients[i].uiid, NoOfUnreadReceivedMessages: data.clients[i].noOfUnreadReceivedMessages, IsRoom: data.clients[i].isRoom });
          }
        }
      }
      this.connections = connectionObservableArray;
      console.log('Connections: ', connectionObservableArray);
    });

    this.socket.fromEvent('broadcast-new-client-connnected').subscribe((data: any) => {
      console.log('New client connected: ', data);
      this.connections.push({ Id: data.id, User: data.username, UIId: data.uiid, NoOfUnreadReceivedMessages: data.noOfUnreadReceivedMessages, IsRoom: data.isRoom });
    });

    this.socket.fromEvent('room-created').subscribe((data: any) => {
      console.log('New client connected: ', data);
      this.connections.push({ Id: data.id, User: data.username, UIId: data.uiid, NoOfUnreadReceivedMessages: data.noOfUnreadReceivedMessages, IsRoom: data.isRoom });
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

    this.socket.fromEvent('response-update-number-of-unread-messages').subscribe((data: any) => {
      let response = data;
      if (response.result === 'success') {
        this.showToastUpdateNumberOfUnreadMessagesSuccess(response.result);
      } else {
        this.showToastUpdateNumberOfUnreadMessagesError(response.result);
      }
    });

  }

  private getNoOfUnreadMessages(senderId) {
    for (var i = 0; i <= this.connections["length"] - 1; i++) {
      if (this.connections[i].Id === senderId) {
        this.connections[i].NoOfUnreadReceivedMessages = ++this.connections[i].NoOfUnreadReceivedMessages;
        console.log('Number of unread messages: ', this.connections[i].NoOfUnreadReceivedMessages);
      }
    }
  }

  private readReceiveMessages(senderId) {
    for (var i = 0; i <= this.connections["length"] - 1; i++) {
      if (this.connections[i].Id === senderId) {
        this.connections[i].NoOfUnreadReceivedMessages = 0;
        console.log('Number of unread messages: ', this.connections[i].NoOfUnreadReceivedMessages);
      }
    }
  }

  userNameKeyPress(event: any) {
    if (this.user.replace(/\s/g, '').length > 0) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }
  }

  addToStorage(user: User) {
    this.storageService.addUser(user).then(data => {
    });
  }

  OnPageReload() {
    this.activatedRoute.params.subscribe(params => {
      this.isfromChat = params["fromchat"];
      this.user = params["socketUserName"];
      this.currentUserUIId = params["currentUserUIId"];
      this.socketId = params["socketId"];
    });

    if (this.isfromChat) {
      this.isfromChat = false;
    }
  }

  private getUserFromStorage(uIId) {
    this.storageService.getUserDetail(uIId);
    this.subUser = this.storageService.userObservable.subscribe(
      data => {
        let userObservableArray = new ObservableArray();
        userObservableArray.push(data);
        this.userObservableArray = userObservableArray;
      }
    );
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

  async showToastUpdateNumberOfUnreadMessagesError(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000,
      color: "danger"
    });
    toast.present();
  }

  async showToastUpdateNumberOfUnreadMessagesSuccess(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 1000,
      color: "primary"
    });
    toast.present();
  }
}
