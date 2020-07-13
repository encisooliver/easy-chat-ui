import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObservableArray } from 'wijmo/wijmo';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})

export class ChatUserListService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient,
    private storage: Storage

  ) { }

  private defaultAPIHostURL: string = this.appSettings.defaultAPIURLHost;

  public options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  public async ListUser() {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await this.storage.get("access_token")
      })
    };

    return this.httpClient.get(this.defaultAPIHostURL + "/api/user/List", options);
  }

  async ChatDetail(receiverId: string) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', 'Authorization': 'Bearer ' + await this.storage.get("access_token")
      })
    };

    return this.httpClient.get(this.defaultAPIHostURL + "/api/chat/chat/detail/" + receiverId, options);
  }
}
