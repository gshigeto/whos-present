import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import 'rxjs/add/operator/map';

/*
  Generated class for the FacebookProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FacebookProvider {

  constructor(private facebook: Facebook) { }

  login(): Promise<any> {
    return this.facebook.login(['public_profile', 'user_friends', 'email'])
  }

  logout(): Promise<any> {
    return this.facebook.logout()
  }

}
