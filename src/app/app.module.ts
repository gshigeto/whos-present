import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

// Ionic Native
import { Facebook } from '@ionic-native/facebook';
// Ionic Native

// Angular Fire
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
// Angular Fire

// Environment Variables
import { ENV } from '@app/env';

// Providers
import { FacebookProvider, FirebaseProvider, FirebaseGroupsProvider, FirebaseOrganizationsProvider, ToasterProvider } from '../providers';
// Providers

import { MyApp } from './app.component';
import { LoginPageModule } from '../pages/login/login.module';
import { MenuPageModule } from '../pages/menu/menu.module';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(ENV.FIREBASE),
    BrowserModule,
    IonicModule.forRoot(MyApp),
    LoginPageModule,
    MenuPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Facebook,
    FacebookProvider,
    FirebaseProvider,
    FirebaseGroupsProvider,
    FirebaseOrganizationsProvider,
    StatusBar,
    SplashScreen,
    ToasterProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
