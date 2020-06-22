import { Component, OnInit, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ModalController, ToastController } from '@ionic/angular';
import { CreateRoomPage } from '../create-room/create-room.page';
import { ObservableArray } from 'wijmo/wijmo';

export interface RoomParticipantsModel {
  UserId: string;
  User: string;
  IsAddedToParticipants: boolean;
}

@Component({
  selector: 'app-add-participant-to-room',
  templateUrl: './add-participant-to-room.page.html',
  styleUrls: ['./add-participant-to-room.page.scss'],
})
export class AddParticipantToRoomPage implements OnInit {
  @Input() userId: any;
  @Input() currentUser: any;
  @Input() currentUserUIId: any;

  roomName = '';
  canCreate: boolean = false;

  constructor(
    private socket: Socket,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
  ) {
  }

  private users: RoomParticipantsModel[] = [];
  private participants = [];

  private isNoOfRoomParticipantsAboveTwo = true;

  ngOnInit() {
    this.socket.emit('get all users');

    console.log('Socket id: ', this.userId);

    this.socket.fromEvent('all-users').subscribe((data: any) => {
      console.log('Users from socket: ', data);
      let connectionObservableArray: ObservableArray = new ObservableArray();
      this.users = [];

      if (data.users["length"] > 0) {
        for (var i = 0; i <= data.users["length"] - 1; i++) {
          if (data.users[i].username !== undefined && data.users[i].username !== '' && data.users[i].uiid !== this.currentUserUIId) {
            connectionObservableArray.push({ UserId: data.users[i].id, User: data.users[i].username, IsAddedToParticipants: false });
          }

          if (data.users[i].id === this.userId) {
            this.participants.push({ UserId: data.users[i].id, User: data.users[i].username });
            console.log(data.users[i].id, ' === ', this.userId);
          }
        }
      }
      this.users = connectionObservableArray;
      console.log('userId === ', this.userId);

      console.log('UIId', this.currentUserUIId, 'Users: ', connectionObservableArray);
    });

    this.socket.fromEvent('create-room-response').subscribe((data: any) => {
      console.log('Users from socket: ', data);
      this.closeModal(data.result);
    });
  }

  async closeModal(data) {
    if (data == 'success') {
      await this.modalCtrl.dismiss({ result: data});
    } else {
    }
  }

  async showToastSetNameError(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000,
    });
    toast.present();
  }

  createNewRoom() {
    let roomId = this.userId + this.roomName + `${new Date().getTime()}`;

    if (this.canCreate === true) {
      this.socket.emit('create room', { roomId: roomId, room: this.roomName, participants: this.participants });
    }
  }

  roomNameKeyPress(event: any) {
    if (this.roomName.replace(/\s/g, '').length > 0) {
      console.log('Key press...');
      this.canCreate = true;
      let createStr = ("CREATE").fontcolor("green");
      let createColor = document.getElementById('create');
      createColor.innerHTML = createStr;
      console.log('Key press...', createStr);
    } else {
      this.canCreate = false;
      let createStr = ("CREATE").fontcolor("grey");
      let createColor = document.getElementById('create');
      createColor.innerHTML = createStr;
    }
  }

  addToRoomParticipants(userId, userName, isAdded) {

    let isParticipantsAdded = false;
    if (isAdded == false) {
      this.updateUserParticipantStatusToTrue(userId);
      isParticipantsAdded = true;
    } else {
      this.updateUserParticipantStatusToFalse(userId);
      isParticipantsAdded = false;
    }

    if (isParticipantsAdded == true) {
      this.participants.push({ UserId: userId, User: userName });
    } else {
      this.participants.splice(this.participants.indexOf(userId), 1);
    }

    let participantsCount = this.participants;
    if (participantsCount["length"] > 2) {
      this.isNoOfRoomParticipantsAboveTwo = false;
    } else {
      this.isNoOfRoomParticipantsAboveTwo = true;
    }

    console.log(userName, ': ', isAdded, ' Room participants: ', this.participants);
  }

  updateUserParticipantStatusToTrue(userId) {
    console.log('UserId: ', userId);
    for (var i = 0; i <= this.users["length"]; i++) {
      if (this.users[i].UserId == userId) {
        this.users[i].IsAddedToParticipants = true;
        break;
      }
    }
  }

  updateUserParticipantStatusToFalse(userId) {
    console.log('UserId: ', userId);
    for (var i = 0; i <= this.users["length"]; i++) {
      if (this.users[i].UserId == userId) {
        this.users[i].IsAddedToParticipants = false;
        break;
      }
    }
  }

  ionViewDidLeave() {
    this.socket.removeAllListeners('all-users');
    this.socket.removeAllListeners('create-room-response');
  }
}
