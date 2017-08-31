import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FirebaseProvider, GoogleAnalyticsProvider } from '../providers';

import { LoginPage } from '../pages/login/login'
import { MenuPage } from '../pages/menu/menu';

import * as firebase from 'firebase/app';
@Component({
  template: `<ion-nav id="nav" [root]="rootPage" #nav swipeBackEnabled="false"></ion-nav>`
})
export class MyApp {
  @ViewChild('nav') nav: Nav;
  rootPage: any;

  constructor(
    private firebase: FirebaseProvider,
    private ga: GoogleAnalyticsProvider,
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
  ) {
    this.platform.ready().then(() => {
      this.init();
    });
  }

  init() {
    this.ga.init();
    this.firebase.authenticated().then((user: firebase.User) => {
      if (user) {
        if (!user.emailVerified && (user.providerData[0] && user.providerData[0].providerId !== 'facebook.com')) this.nav.setRoot(LoginPage);
        else this.nav.setRoot(MenuPage);
      }
      else this.nav.setRoot(LoginPage);
    }).then(_ => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}

