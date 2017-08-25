import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';

import { SubOrganization } from '../../../models/user.model';

import { FirebaseProvider, ToasterProvider } from '../../../providers';
import { OrgGroupsPage } from './org-groups/org-groups';

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
    private navCtrl: NavController,
    private navParams: NavParams,
    private popover: PopoverController,
    private firebase: FirebaseProvider,
    private toast: ToasterProvider
  ) {
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
            else this.firebase.createOrganization(data.title);
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

  delete(organization: SubOrganization) {
    let confirm = this.alert.create({
      title: `Delete ${organization.title}?`,
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
            }).catch(err => {
              this.toast.showToast(err);
            });
          }
        }
      ]
    });
    confirm.present();
  }

  groups(organization: SubOrganization) {
    this.navCtrl.push(OrgGroupsPage, { SubOrg: organization });
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
  constructor(private alert: AlertController, private firebase: FirebaseProvider, private toast: ToasterProvider, private viewCtrl: ViewController) { }

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
            else this.firebase.createOrganization(data.title);
          }
        }
      ]
    });
    prompt.present();
  }
}
