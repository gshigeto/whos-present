import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, PopoverController, ViewController } from 'ionic-angular';

import { SubOrganization } from '../../../../models';

import { FirebaseProvider, GoogleAnalyticsProvider, ToasterProvider } from '../../../../providers';
import { OrganizationDetailsPage } from '../organization-details/organization-details';

/**
 * Generated class for the OrganizationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-organizations',
  templateUrl: 'organizations.html',
})
export class OrganizationsPage {

  constructor(
    private alert: AlertController,
    private firebase: FirebaseProvider,
    private ga: GoogleAnalyticsProvider,
    private navCtrl: NavController,
    private popover: PopoverController,
    private toast: ToasterProvider
  ) {
  }

  ionViewDidEnter() {
    this.ga.trackView('Organizations');
  }

  addOrganization() {
    let prompt = this.alert.create({
      title: 'New Organization',
      message: "Title of new organization",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Create',
          handler: data => {
            if (data.title === '') this.toast.showToast('Title cannot be empty');
            else {
              this.firebase.createOrganization(data.title);
              this.ga.trackEvent(`Organizations`, `Create`);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  presentPopover(ev) {
    let popover = this.popover.create(OrganizationPopover);

    popover.present({
      ev: ev
    });
  }

  edit(organization: SubOrganization) {
    let prompt = this.alert.create({
      title: 'New Title',
      message: "Enter a new title for this organization",
      inputs: [{
        name: 'title',
        placeholder: 'Title',
        value: organization.title
      }],
      buttons: [
        {
          text: 'Cancel'
        }, {
          text: 'Update',
          handler: data => {
            if (data.title === '') this.toast.showToast('Title cannot be empty');
            else {
              this.firebase.updateOrganization(organization.$key, data.title).then(_ => {
                this.toast.showToast(`Organization Updated`);
                this.ga.trackEvent(`Organizations`, `Update`);
              }).catch(err => {
                this.toast.showToast(`${err}`);
              });
            }
          }
        }
      ]
    });
    prompt.present();
  }

  delete(organization: any) {
    let confirm = this.alert.create({
      title: `Delete ${organization.$value}?`,
      message: 'Deleting an organization will delete all groups and people associated and cannot be undone.',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.firebase.deleteOrganization(organization.$key).then(_ => {
              this.toast.showToast('Organization Deleted');
              this.ga.trackEvent(`Organizations`, `Delete`);
            }).catch(err => {
              this.toast.showToast(err);
            });
          }
        }
      ]
    });
    confirm.present();
  }

  details(organization: SubOrganization) {
    this.navCtrl.push(OrganizationDetailsPage, { organization: organization });
  }
}

@Component({
  template: `
    <ion-list class="popover">
      <ion-item (tap)="addOrganization()">
        Create Organization
      </ion-item>
    </ion-list>
  `
})
export class OrganizationPopover {
  constructor(private alert: AlertController, private firebase: FirebaseProvider, private ga: GoogleAnalyticsProvider, private toast: ToasterProvider, private viewCtrl: ViewController) { }

  addOrganization() {
    this.viewCtrl.dismiss();
    let prompt = this.alert.create({
      title: 'New Organization',
      message: "Title of new organization",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Create',
          handler: data => {
            if (data.title === '') this.toast.showToast('Title cannot be empty');
            else {
              this.firebase.createOrganization(data.title);
              this.ga.trackEvent(`Organizations`, `Create`);
            }
          }
        }
      ]
    });
    prompt.present();
  }
}
