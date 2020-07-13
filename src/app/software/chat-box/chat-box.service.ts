import { Injectable } from '@angular/core';
import { AppSettings } from 'src/app/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ObservableArray } from 'wijmo/wijmo';
import { Storage } from '@ionic/storage';
import { ChatMessageModel } from './chat-message.model';
@Injectable({
  providedIn: 'root'
})
export class ChatBoxService {

  constructor(
    private appSettings: AppSettings,
    private httpClient: HttpClient,
    private storage: Storage,

  ) { }

  private defaultAPIHostURL: string = this.appSettings.defaultAPIURLHost;
  private token: any;

  public messageSource = new Subject<string[]>();
  public messageObservable = this.messageSource.asObservable();


  public async ListMessage(chatId) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await this.storage.get("access_token")
      })
    };

    return this.httpClient.get(this.defaultAPIHostURL + "/api/message/list/" + chatId, options);
  }

  public async SendMessage(chatId: number, receiverId: number, objChatMessage: ChatMessageModel) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + await this.storage.get("access_token")
      })
    };

    return this.httpClient.post(this.defaultAPIHostURL + "/api/message/send/" + chatId + "/" + receiverId, JSON.stringify(objChatMessage), options);
  }
}
