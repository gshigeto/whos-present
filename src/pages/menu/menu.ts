import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';

import { TabsPage } from './tabs/tabs';
import { LoginPage } from '../login/login';

import { FirebaseProvider } from '../../providers';

/**
 * Generated class for the MenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  @ViewChild('homeNav') nav: Nav;
  homeRoot: any = TabsPage;

  constructor(private firebase: FirebaseProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  logout() {
    this.firebase.logout().then(_ => {
      this.homeRoot = LoginPage;
    }).catch(err => {
      console.log(`Logout Error: ${err}`);
      this.homeRoot = LoginPage;
    });
  }

}
