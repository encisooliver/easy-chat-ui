import { Component, OnInit, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ModalController } from '@ionic/angular';
import { ChatCreateGroupService } from './chat-create-group.service';
import { Storage } from '@ionic/storage';
import { ChatBoxComponent } from '../chat-box/chat-box.component';

export interface RoomParticipantsModel {
  Id: string;
  User: string;
  IsAddedToParticipants: boolean;
}

@Component({
  selector: 'app-chat-create-group',
  templateUrl: './chat-create-group.component.html',
  styleUrls: ['./chat-create-group.component.scss'],
})
export class ChatCreateGroupComponent implements OnInit {

  @Input() userId: any;
  @Input() currentUserName: any;
  @Input() currentUserUIId: any;
  roomName = '';
  canCreate: boolean = false;

  private isNoOfRoomParticipantsAboveTwo = true;

  private users: RoomParticipantsModel[] = [];
  private groupParticipants = [];

  constructor(
    private socket: Socket,
    private modalCtrl: ModalController,
    private ChatCreateGroupService: ChatCreateGroupService,
    private storage: Storage
  ) { }

  private userListSubcription: any;
  private createRoomSubscription: any;
  private chatDetailSubscription: any;

  ngOnInit() {
    this.getUserList();

    this.socket.fromEvent('create-room-response').subscribe((data: any) => {
      console.log('Users from socket: ', data);
      this.backToAppParticipantsModal(data.result);
    });
  }

  private async getUserList() {
    this.userListSubcription = await (await this.ChatCreateGroupService.ListUser()).subscribe(data => {
      let userListArray: any = [];
      if (data["length"] > 0) {
        for (var i = 0; i <= data["length"] - 1; ++i) {
          if (data[i].UserName !== this.currentUserName) {
            userListArray.push({
              Id: data[i].Id,
              FullName: data[i].FullName,
              IsAddedToParticipants: false
            });
          }

          if (data[i].UserName === this.currentUserName) {
            console.log(data[i].UserName, ' === ', this.currentUserName);
            console.log(data[i]);

            this.groupParticipants.push(data[i].Id);
          }
        }
      }

      this.users = userListArray;
      if (this.userListSubcription != null) this.userListSubcription.unsubscribe();
    });
  }

  async createNewRoom() {
    this.createRoomSubscription = await (await this.ChatCreateGroupService.CreateRoom(this.groupParticipants, this.roomName)).subscribe(
      response => {
        let chatId = response;
        this.getChatName(chatId);
        if (this.createRoomSubscription != null) this.createRoomSubscription.unsubscribe();
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
      }
    );
  }

  async getChatName(chatId) {
    this.createRoomSubscription = await (await this.ChatCreateGroupService.ChatDetail(chatId)).subscribe(
      response => {
        let chatName = response["ChatName"];
        this.modalCtrl.dismiss({ "event": "create-room", "chatId": chatId, "chatName": chatName });
      },
      error => {
        let errorResults: string[] = ["failed", error["error"]];
      }
    );
  }

  async showChatBoxModal(chatId, receiverId, receiverUserName, chatName) {
    let modal = await this.modalCtrl.create({
      component: ChatBoxComponent,
      componentProps: {
        chatId: chatId,
        receiverId: receiverId,
        receiverUserName: receiverUserName,
        receiverFullName: chatName,
        username: this.currentUserName,
      }, cssClass: "modal-fullscreen"
    });

    await modal.present();
    await modal.onDidDismiss().then(() => {
    });
  }

  async backToAppParticipantsModal(result) {
    if (result == 'success') {
      await this.modalCtrl.dismiss({ success: true });
    }
  }

  roomNameKeyPress(event: any) {
    if (this.roomName.replace(/\s/g, '').length > 0) {
      this.canCreate = true;
      let createStr = ("CREATE").fontcolor("green");
      let createColor = document.getElementById('create');
      createColor.innerHTML = createStr;
    } else {
      this.canCreate = false;
      let createStr = ("CREATE").fontcolor("grey");
      let createColor = document.getElementById('create');
      createColor.innerHTML = createStr;
    }
  }

  async addToRoomParticipants(userId, userName, isAdded) {
    if (isAdded == false) {
      await this.updateUserParticipantStatusToTrue(userId);
      await this.groupParticipants.push(userId);
    } else {
      await this.updateUserParticipantStatusToFalse(userId);
      await this.groupParticipants.splice(this.groupParticipants.indexOf(userId), 1);
    }

    await this.btnCreateDisableEnable();
  }

  async btnCreateDisableEnable() {
    let participantsCount = await this.groupParticipants;
    if (participantsCount["length"] > 2) {
      this.isNoOfRoomParticipantsAboveTwo = false;
    } else {
      this.isNoOfRoomParticipantsAboveTwo = true;
    }
  }

  updateUserParticipantStatusToTrue(userId) {
    for (var i = 0; i <= this.users["length"] - 1; i++) {
      if (this.users[i].Id == userId) {
        this.users[i].IsAddedToParticipants = true;
        console.log(this.users[i].IsAddedToParticipants);
        break;
      }
    }
  }

  updateUserParticipantStatusToFalse(userId) {
    for (var i = 0; i <= this.users["length"] - 1; i++) {
      if (this.users[i].Id == userId) {
        this.users[i].IsAddedToParticipants = false;
        console.log(this.users[i].IsAddedToParticipants);
        break;
      }
    }
  }

  async closeModal() {
    await this.modalCtrl.dismiss({ "event": "close-modal" });
  }

  ionViewDidLeave() {
    this.socket.removeAllListeners('create-room-response');
    if (this.chatDetailSubscription != null) this.chatDetailSubscription.unsubscribe();
    if (this.createRoomSubscription != null) this.createRoomSubscription.unsubscribe();
    if (this.userListSubcription != null) this.userListSubcription.unsubscribe();
  }
}
