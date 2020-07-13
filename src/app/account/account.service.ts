import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { ObservableArray } from 'wijmo/wijmo';
import { Subject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AppSettings } from '../app-settings';
import { AccountModel } from './account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient,
    private storage: Storage,
    private router: Router,
  ) { }

  public registerSource = new Subject<string[]>();
  public registerObservable = this.registerSource.asObservable();

  public defaultAPIHostURL: string = this.appSettings.defaultAPIURLHost;

  public loginSource = new Subject<[boolean, string]>();
  public loginObservable = this.loginSource.asObservable();

  public login(username: string, password: string): void {
    console.log("username: ",username, " password: ",password);

    let url = this.defaultAPIHostURL + '/token';
    let body = "username=" + username + "&password=" + password + "&grant_type=password";
    let options = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) };

    this.httpClient.post(url, body, options).subscribe(
      response => {
        this.storage.set('access_token', response["access_token"]);
        this.storage.set('expires_in', response["expires_in"]);
        this.storage.set('token_type', response["token_type"]);
        this.storage.set('username', response["userName"]);
        this.loginSource.next([true, "Login Successful."]);
      },
      error => {
        this.loginSource.next([false, error["error"].error_description]);
      }
    )
  }

  public register(objUser: AccountModel): void {
    console.log("Register: ", objUser);

    let url = this.defaultAPIHostURL + '/api/Account/Register';
    let options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    this.httpClient.post(url, JSON.stringify(objUser), options).subscribe(
      response => {
        let responseResults: string[] = ["success", "Registered!"];
        this.registerSource.next(responseResults);
        console.log(response);
      },
      error => {
        let responseResults: string[] = ["failed", "Registration failed!"];
        this.registerSource.next(responseResults);
        console.log(error);
      }
    )
  }
}
