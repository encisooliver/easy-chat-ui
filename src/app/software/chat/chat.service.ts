import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ObservableArray } from 'wijmo/wijmo';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient,
    private storage: Storage,

  ) { }

  private defaultAPIHostURL: string = this.appSettings.defaultAPIURLHost;

  public async ListChat() {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await this.storage.get("access_token")
      })
    };

    return this.httpClient.get(this.defaultAPIHostURL + "/api/chat/list", options);
  }
}
