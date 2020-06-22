import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatCreateGroupPage } from './chat-create-group.page';

const routes: Routes = [
  {
    path: '',
    component: ChatCreateGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatCreateGroupPageRoutingModule {}
