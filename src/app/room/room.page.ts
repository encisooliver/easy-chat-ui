import { Component, OnInit, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ModalController } from '@ionic/angular';
import { AddParticipantToRoomPage } from '../add-participant-to-room/add-participant-to-room.page';
import { ObservableArray } from 'wijmo/wijmo';

export interface RoomModel {
  RoomId: string;
  Room: string;
}

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  @Input() userId: any;
  @Input() currentUser: any;
  @Input() currentUserUIId: any;

  private chatRooms: RoomModel[] = [];

  constructor(private socket: Socket,
    private modalCtrl: ModalController,) { }

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
      component: AddParticipantToRoomPage,
      componentProps: {
        userId: this.userId,
        currentUser: this.currentUser,
        currentUserUIId: this.currentUserUIId
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
