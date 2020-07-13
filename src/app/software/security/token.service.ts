import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private storage: Storage
  ) { }

  async getToken() {
    try { return await this.storage.get("access_token") }
    catch (e) { console.log(e) }
  }

  public toket() {
    this.getToken().then((token) => {
      return token;
    });
  }
}
