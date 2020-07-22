import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ChatCreateGroupService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient,
    private storage: Storage
  ) { }

  private defaultAPIHostURL: string = this.appSettings.defaultAPIURLHost;

  public async ListUser() {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await this.storage.get("access_token")
      })
    };

    return this.httpClient.get(this.defaultAPIHostURL + "/api/user/List", options);
  }

  public async CreateRoom(userIds: number[], roomName: string) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await this.storage.get("access_token")
      })
    };

    return this.httpClient.post(this.defaultAPIHostURL + "/api/chat/createRoom/" + roomName, JSON.stringify(userIds), options);
  }

  public async ChatDetail(chatId: number) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await this.storage.get("access_token")
      })
    };

    return this.httpClient.get(this.defaultAPIHostURL + "/api/chat/detail/" + chatId, options);
  }
}
