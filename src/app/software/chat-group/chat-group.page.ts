import { Component, OnInit, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ModalController } from '@ionic/angular';
import { ObservableArray } from 'wijmo/wijmo';

export interface RoomModel {
  RoomId: string;
  Room: string;
}
@Component({
  selector: 'app-chat-group',
  templateUrl: './chat-group.page.html',
  styleUrls: ['./chat-group.page.scss'],
})
export class ChatGroupPage implements OnInit {

  constructor(
    private socket: Socket,
    private modalCtrl: ModalController
  ) { }

  @Input() userId: any;
  @Input() currentUser: any;

  private chatRooms: RoomModel[] = [];

  ngOnInit() {
    this.socket.emit('get rooms');

    this.socket.fromEvent('room-list').subscribe((data: any) => {
      let roomObservableArray: ObservableArray = new ObservableArray();
      this.chatRooms = [];

      if (data.room["length"] > 0) {
        for (var i = 0; i <= data.room["length"] - 1; i++) {
          roomObservableArray.push({ RoomId: data.room[i].roomId, Room: data.room[i].room });
        }
        this.chatRooms = roomObservableArray;
      }
    });
  }

  async backToUserList() {
    await this.modalCtrl.dismiss();
  }

  async showAddParticipantToRoomModal() {
    let modal = await this.modalCtrl.create({
      component: '',
      componentProps: {
        userId: this.userId,
        currentUser: this.currentUser,
      },
      cssClass: "modal-fullscreen"
    })
    await modal.present();
    await modal.onDidDismiss().then(data => {
      console.log('Result: ', data);

      if (data.data.result == 'success') {
        this.socket.emit('get rooms');
      }
    });
  }
}
