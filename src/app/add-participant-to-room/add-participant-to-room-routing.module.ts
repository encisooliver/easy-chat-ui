import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddParticipantToRoomPage } from './add-participant-to-room.page';

const routes: Routes = [
  {
    path: '',
    component: AddParticipantToRoomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddParticipantToRoomPageRoutingModule {}
