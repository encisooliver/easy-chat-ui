import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SoftwarePageRoutingModule } from './software-routing.module';

import { SoftwarePage } from './software.page';
import { IonicStorageModule } from '@ionic/storage';
import { ChatComponent } from './chat/chat.component';
import { ChatUserListComponent } from './chat-user-list/chat-user-list.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatCreateGroupComponent } from './chat-create-group/chat-create-group.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SoftwarePageRoutingModule,
    IonicStorageModule.forRoot(),
  ],
  declarations: [SoftwarePage, ChatComponent, ChatUserListComponent, ChatBoxComponent , ChatCreateGroupComponent]
})
export class SoftwarePageModule {}
