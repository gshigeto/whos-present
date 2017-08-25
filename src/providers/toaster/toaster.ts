import { Injectable } from '@angular/core';
import { ToastController, ToastOptions } from 'ionic-angular';

/*
  Generated class for the ToasterProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ToasterProvider {

  constructor(private toast: ToastController) { }

  public showToast(message: string, duration = 3000, showCloseButton = false, closeButtonText = 'OK', position = 'top') {
    let toastConfig: ToastOptions = {
      message: message,
      showCloseButton: showCloseButton,
      position: position,
      closeButtonText: closeButtonText
    };
    if (!showCloseButton) {
      toastConfig.duration = duration;
    }
    let toast = this.toast.create(toastConfig);
    toast.present();
  }

}
