import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private socket: Socket,
    private modalCtrl: ModalController
  ) { }

  private user = "Oliver Enciso";

  ngOnInit() {
  }

  async close() {
    await this.modalCtrl.dismiss();
  }

}
