import { Component, OnInit, Input } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.page.html',
  styleUrls: ['./create-room.page.scss'],
})
export class CreateRoomPage implements OnInit {

  @Input() userId: any;
  @Input() currentUser: any;
  @Input() currentUserUIId: any;
  @Input() participants: any;
  roomName = '';
  canCreate: boolean = false;

  constructor(
    private socket: Socket,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log('Participants: ', this.participants);

    this.socket.fromEvent('create-room-response').subscribe((data: any) => {
      console.log('Users from socket: ', data);
      this.backToAppParticipantsModal(data.result);
    });
  }

  createNewRoom() {
    let roomId = this.userId + this.roomName + `${new Date().getTime()}`;

    if (this.canCreate === true) {
      this.socket.emit('create room', { roomId: roomId, room: this.roomName, participants: this.participants });
    }
  }

  async backToAppParticipantsModal(result) {
    if (result == 'success') {
      await this.modalCtrl.dismiss({ success: true });
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

  ionViewDidLeave() {
    this.socket.removeAllListeners('create-room-response');
  }

}
