import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { CreateAccountPageModule } from './create-account/create-account.module';

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    CreateAccountPageModule,
    IonicPageModule.forChild(LoginPage)
  ],
})
export class LoginPageModule { }
