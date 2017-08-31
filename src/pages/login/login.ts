import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController } from 'ionic-angular';

import { MenuPage } from '../menu/menu';
import { CreateAccountPage } from './create-account/create-account'

import { FirebaseProvider, GoogleAnalyticsProvider, ToasterProvider } from '../../providers'

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = { email: '', password: '' };
  constructor(
    private alert: AlertController,
    private firebase: FirebaseProvider,
    private ga: GoogleAnalyticsProvider,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private toast: ToasterProvider
  ) {
  }

  ionViewDidLoad() {
    this.ga.trackView('Login');
  }

  createAccount() {
    this.navCtrl.push(CreateAccountPage)
  }

  forgotPassword() {
    let prompt = this.alert.create({
      title: 'Forgot Password',
      message: "Please enter your email address where we will send a link to update your password",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Send',
          handler: data => {
            this.firebase.sendForgotPasswordEmail(data.email).then(_ => {
              this.toast.showToast('Email sent!');
            }).catch(err => {
              this.toast.showToast(err.message);
            });
          }
        }
      ]
    });
    prompt.present();
  }

  login() {
    let loader = this.loadingCtrl.create({
      content: "Logging in",
    });
    loader.present();

    this.firebase.firebaseLogin(this.user.email, this.user.password).then(user => {
      loader.dismiss();
      if (user.emailVerified) this.navCtrl.setRoot(MenuPage);
      else this.showEmailPrompt();
    }).catch(err => {
      loader.dismiss();
      this.toast.showToast(err.message);
    });
  }

  private showEmailPrompt() {
    let prompt = this.alert.create({
      title: 'Verify your email',
      message: 'You must verify your email address before entering',
      buttons: [
        {
          text: 'Okay'
        },
        {
          text: 'Resend Email',
          handler: data => {
            this.firebase.sendVerificationEmail().then(_ => {
              this.toast.showToast('Email sent!')
            }).catch(err => {
              this.toast.showToast(err.message);
            });
          }
        }
      ]
    });
    prompt.present();
  }

  facebook() {
    let loader = this.loadingCtrl.create({
      content: "Logging in",
    });
    loader.present();

    this.firebase.facebookLogin().then(_ => {
      loader.dismiss();
      this.navCtrl.setRoot(MenuPage);
    }).catch(err => {
      loader.dismiss();
      this.toast.showToast(err.message, null, );
    });
  }

  google() {
    let loader = this.loadingCtrl.create({
      content: "Logging in",
    });
    loader.present();

    // this.firebase.googleLogin().then(() => {
    //   loader.dismiss();
    //   this.ga.trackEvent('Login', 'Google', 'Success');
    //   this.navCtrl.setRoot(MenuPage);
    // }).catch(err => {
    //   loader.dismiss();
    //   this.ga.trackEvent('Login', 'Google', err.message);
    //   this.toast.showToast(err.message, 6000);
    // });
  }

}
