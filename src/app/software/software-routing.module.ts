import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SoftwarePage } from './software.page';
import { ChatComponent } from './chat/chat.component';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';

const routes: Routes = [
  // { path: '', component: SoftwarePage },
  { path: 'chat', component: ChatComponent },
  { path: 'user-list', component: ChatUserListComponent },
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoftwarePageRoutingModule { }
