import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AccountModel } from '../account.model';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  private user: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController,
    private accountService: AccountService
  ) {
    // this.user = this.formBuilder.group({
    //   Username: ['', Validators.required],
    //   firstName: ['', Validators.required],
    //   lastName: ['', Validators.required],
    //   middleName: ['', Validators.required],
    //   email: ['', Validators.required],
    //   password: ['', Validators.required],
    //   confirm: ['', Validators.required],
    // });
  }

  private accountModel: AccountModel = {
    Fullname: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
  }

  private firstName = '';
  private middleName = '';
  private lastName = '';

  private registerSubscription: any;

  ngOnInit() { }

  register() {
    console.log("User Detail: ", this.accountModel);

    if (this.firstName !== '' && this.middleName !== '' && this.lastName !== ''&& this.accountModel.Password !== ''&& this.accountModel.ConfirmPassword !== '') {
      this.accountModel.Fullname = this.firstName + ' ' + this.middleName + ' ' + this.lastName;
      console.log("User Detail: ", this.accountModel);
      this.accountService.register(this.accountModel);
      this.registerSubscription = this.accountService.registerObservable.subscribe(
        data => {
          if (data[0] == "success") {
            this.success("Registered successfully");
          } else if (data[0] == "failed") {
            this.error(data[1]);
          }
          if (this.registerSubscription != null) this.registerSubscription.unsubscribe();
        }
      );
    } else {
      this.error("Please don't leave empty fields.");
    }
  }

  async success(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 1000,
      color: "primary"
    });
    toast.present();
  }

  async error(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000,
      color: "danger"
    });
    toast.present();
  }

}
