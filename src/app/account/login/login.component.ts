import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginModel } from './login.model';
import { ToastController } from '@ionic/angular';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {


  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private accountService: AccountService,
  ) { }

  public loginSub: any;
  
  public loginModel: LoginModel = {
    UserName: "",
    Password: ""
  };

  public login(): void {
    let btnLogin: Element = document.getElementById("btnLogin");
    btnLogin.setAttribute("disabled", "disabled");
    btnLogin.setAttribute("value", "Signing in...");

    let inpUsername: Element = document.getElementById("inpUsername");
    inpUsername.setAttribute("disabled", "disabled");

    let inpPassword: Element = document.getElementById("inpPassword");
    inpPassword.setAttribute("disabled", "disabled");

    console.log("Login Detail: ", (<HTMLInputElement>inpUsername).value);

    if ((<HTMLInputElement>inpUsername).value === "" || (<HTMLInputElement>inpPassword).value === "") {
      this.error('Username or Password is empty.');

      btnLogin.removeAttribute("disabled");
      btnLogin.setAttribute("value", "Sign in");
      inpUsername.removeAttribute("disabled");
      inpPassword.removeAttribute("disabled");
    } else {
      this.accountService.login((<HTMLInputElement>inpUsername).value, (<HTMLInputElement>inpPassword).value);
      this.loginSub = this.accountService.loginObservable.subscribe(
        data => {
          if (data[0]) {
            setTimeout(() => {
              this.router.navigate(['/easychat']);
              this.success(data[1]);
            }, 100);
          } else {
            this.error(data[1]);
            btnLogin.removeAttribute("disabled");
            btnLogin.setAttribute("value", "Sign in");
            inpUsername.removeAttribute("disabled");
            inpPassword.removeAttribute("disabled");
          }
          if (this.loginSub != null) this.loginSub.unsubscribe();
        }
      );
    }
  }

  ngOnInit() {
    console.log(this.loginModel)
  }

  ngOnDestroy() {
    if (this.loginSub != null) this.loginSub.unsubscribe();
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
