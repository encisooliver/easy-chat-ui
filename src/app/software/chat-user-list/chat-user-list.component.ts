import { Component, OnInit, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ModalController } from '@ionic/angular';
import { ObservableArray } from 'wijmo/wijmo';
import { ChatUserListService } from './chat-user-list.service';
import { ChatBoxComponent } from '../chat-box/chat-box.component';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { ChatCreateGroupComponent } from '../chat-create-group/chat-create-group.component';

export interface RoomModel {
  RoomId: string;
  Room: string;
}

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss'],
})
export class ChatUserListComponent implements OnInit {

  constructor(
    private socket: Socket,
    private modalCtrl: ModalController,
    private chatUserListService: ChatUserListService,
  ) { }

  @Input() currentUserName: any;

  private userListSubcription: any;
  public userListObservableArray: ObservableArray = new ObservableArray();

  private chatSub: any;

  ngOnInit() {
    this.getUserList();
  }

  private async getUserList() {
    this.userListSubcription = await (await this.chatUserListService.ListUser()).subscribe(data => {
      let userListObservableArray = new ObservableArray();
      if (data["length"] > 0) {
        for (var i = 0; i <= data["length"] - 1; ++i) {
          userListObservableArray.push({
            Id: data[i].Id,
            UserName: data[i].UserName,
            FullName: data[i].FullName
          });
        }
      }

      this.userListObservableArray = userListObservableArray;
      if (this.userListSubcription != null) this.userListSubcription.unsubscribe();
    });
  }


  async chatBox(userId, username, userFullName) {
    this.chatSub = (await this.chatUserListService.ChatDetail(userId)).subscribe(data => {
      let result = data;
      if (result != null) {
        this.showChatBoxModal(userId, username, userFullName, result["Id"]);
      } else {
        this.showChatBoxModal(userId, username, userFullName, 0);
      }
      if (this.chatSub != null) this.chatSub.unsubscribe();
    });
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  async showAddParticipantToRoomModal() {
    let modal = await this.modalCtrl.create({
      component: ChatCreateGroupComponent,
      componentProps: {
        currentUserName: this.currentUserName,
      },
      cssClass: "modal-fullscreen"
    })

    await modal.present();
    await modal.onDidDismiss().then(data => {
      if (data['data'].event == 'create-room') {
        this.showChatBoxModal(0, '', data['data'].chatName, data['data'].chatId);
      }
    });
  }

  async showChatBoxModal(userId, username, userFullName, chatId) {
    setTimeout(() => { }, 300);
    let modal = await this.modalCtrl.create({
      component: ChatBoxComponent,
      componentProps: {
        chatId: chatId,
        receiverId: userId,
        receiverUserName: username,
        receiverFullName: userFullName,
        username: this.currentUserName,
      }, cssClass: "modal-fullscreen"
    });

    await modal.present();
    await modal.onDidDismiss().then(() => {
    });
  }

  ionViewDidLeave() {
    if (this.userListSubcription != null) this.userListSubcription.unsubscribe();
    if (this.chatSub != null) this.chatSub.unsubscribe();
  }
}
