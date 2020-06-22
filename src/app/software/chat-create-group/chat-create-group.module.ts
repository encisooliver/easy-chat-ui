import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatCreateGroupPageRoutingModule } from './chat-create-group-routing.module';

import { ChatCreateGroupPage } from './chat-create-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatCreateGroupPageRoutingModule
  ],
  declarations: [ChatCreateGroupPage]
})
export class ChatCreateGroupPageModule {}
