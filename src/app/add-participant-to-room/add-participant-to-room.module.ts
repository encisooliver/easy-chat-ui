import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddParticipantToRoomPageRoutingModule } from './add-participant-to-room-routing.module';

import { AddParticipantToRoomPage } from './add-participant-to-room.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddParticipantToRoomPageRoutingModule
  ],
  declarations: [AddParticipantToRoomPage]
})
export class AddParticipantToRoomPageModule {}
