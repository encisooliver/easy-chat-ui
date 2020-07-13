import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';

import { AccountPage } from './account.page';
import { RegisterComponent } from './register/register.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AccountPageRoutingModule
  ],
  providers: [FormsModule, FormBuilder ],
  declarations: [AccountPage, RegisterComponent],
})
export class AccountPageModule { }
