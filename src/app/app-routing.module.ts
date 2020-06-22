import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'user-list',
    loadChildren: () => import('./user-list/user-list.module').then( m => m.UserListPageModule)
  },
  {
    path: 'user-list/:username',
    loadChildren: () => import('./user-list/user-list.module').then( m => m.UserListPageModule)
  },
  {
    path: 'chat-room/:currentUser/:receiverId/:receiver',
    loadChildren: () => import('./chat-room/chat-room.module').then( m => m.ChatRoomPageModule)
  },
  {
    path: 'user-list/:socketId/:socketUserName/:uiid/:fromchat',
    loadChildren: () => import('./user-list/user-list.module').then( m => m.UserListPageModule)
  },
  
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'room',
    loadChildren: () => import('./room/room.module').then( m => m.RoomPageModule)
  },
  {
    path: 'add-participant-to-room',
    loadChildren: () => import('./add-participant-to-room/add-participant-to-room.module').then( m => m.AddParticipantToRoomPageModule)
  },
  {
    path: 'create-room',
    loadChildren: () => import('./create-room/create-room.module').then( m => m.CreateRoomPageModule)
  },
  {
    path: '',
    redirectTo: 'user-list',
    pathMatch: 'full'
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule)
  },
  // {
  //   path: 'easychat',
  //   loadChildren: () => import('./software/software.module').then( m => m.SoftwarePageModule)
  // },

  // new software structure
  { path: 'easychat', loadChildren: './software/software.module#SoftwarePageModule' },
  { path: 'chat', loadChildren: './software/chat/chat.module#ChatPageModule' },
  { path: 'chat-box', loadChildren: './software/chat-box/chat-box.module#ChatBoxPageModule' },
  { path: 'chat-group', loadChildren: './software/chat-group/chat-group.module#ChatGroupPageModule' },
  { path: 'chat-create-group', loadChildren: './software/chat-create-group/chat-create-group.module#ChatCreateGroupPageModule' },
  { path: 'user-profile', loadChildren: './software/profile/profile.module#ProfilePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
