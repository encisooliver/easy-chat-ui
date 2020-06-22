import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SoftwarePage } from './software.page';
import { ChatPage } from './chat/chat.page';

const routes: Routes = [
  {
    path: '',
    component: SoftwarePage
  },
  {
    path: 'chat',
    component: ChatPage
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoftwarePageRoutingModule {}
