import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';

import { LoginPage } from '../login';
import { FirebaseProvider, ToasterProvider } from '../../../providers';

/**
 * Generated class for the CreateAccountPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html',
})
export class CreateAccountPage {

  createForm: any;
  constructor(private firebase: FirebaseProvider, private formBuilder: FormBuilder, private loading: LoadingController, private navCtrl: NavController, private toast: ToasterProvider) {
    this.createForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.pattern('^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$'), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(8), Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.minLength(8), Validators.required])],
    });
  }

  createAccount(form) {
    if (form.value.password !== form.value.confirmPassword) {
      this.toast.showToast('Passwords do not match');
      return;
    }

    let loader = this.loading.create({
      content: "Creating your account",
    });
    loader.present();

    this.firebase.createFirebaseUser(form.value).then(_ => {
      loader.dismiss();
      this.navCtrl.setRoot(LoginPage);
      this.toast.showToast('Check your email for an email verification!')
    }).catch(err => {
      loader.dismiss();
      this.toast.showToast(err.message);
    });
  }

}
