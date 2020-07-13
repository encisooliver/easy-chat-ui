import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule) },
  { path: 'user-list', loadChildren: () => import('./user-list/user-list.module').then( m => m.UserListPageModule) },
  { path: 'user-list/:username', loadChildren: () => import('./user-list/user-list.module').then( m => m.UserListPageModule) },
  { path: 'chat-room/:currentUser/:receiverId/:receiver', loadChildren: () => import('./chat-room/chat-room.module').then( m => m.ChatRoomPageModule) },
  { path: 'user-list/:socketId/:socketUserName/:uiid/:fromchat', loadChildren: () => import('./user-list/user-list.module').then( m => m.UserListPageModule) },
  
  { path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule) },
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule) },
  { path: 'room', loadChildren: () => import('./room/room.module').then( m => m.RoomPageModule) },
  { path: 'add-participant-to-room', loadChildren: () => import('./add-participant-to-room/add-participant-to-room.module').then( m => m.AddParticipantToRoomPageModule) },
  { path: 'create-room', loadChildren: () => import('./create-room/create-room.module').then( m => m.CreateRoomPageModule) },
  { path: 'account/a', loadChildren: () => import('./account/account.module').then( m => m.AccountPageModule) },
  
  { path: '',
    redirectTo: 'account',
    pathMatch: 'full'
  },

  // new software structure
  { path: 'account', loadChildren: './account/account.module#AccountPageModule' },
  { path: 'easychat', loadChildren: './software/software.module#SoftwarePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
