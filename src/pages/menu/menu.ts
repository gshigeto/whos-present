import { Component, ViewChild } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams, Nav } from 'ionic-angular';

import { GroupsPage } from './groups/groups';
import { OrganizationsPage } from './organizations/organizations';
import { ReportsPage } from './reports/reports';
import { SettingsPage } from './settings/settings';
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
  homeRoot: any = OrganizationsPage;

  allPages = [{
    name: 'Organizations',
    icon: 'person',
    page: OrganizationsPage
  }, {
    name: 'Groups',
    icon: 'people',
    page: GroupsPage
  }, {
    name: 'Reports',
    icon: 'stats',
    page: ReportsPage
  }, {
    name: 'Settings',
    icon: 'settings',
    page: SettingsPage
  }];
  pages: Array<any> = [];

  constructor(private firebase: FirebaseProvider, private menu: MenuController, public navCtrl: NavController, public navParams: NavParams) {
    this.setPages('organizations')
  }

  goTo(name: string, page) {
    this.menu.close();
    this.setPages(name);
    this.homeRoot = page;
  }

  setPages(name: string) {
    this.pages = this.allPages.filter(page => { return page.name.toLowerCase() !== name.toLowerCase(); });
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
