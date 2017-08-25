import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { SubOrganization, SubGroup } from '../../../../models/user.model';
import { Person } from '../../../../models/organization.model';
import { FirebaseProvider, ToasterProvider } from '../../../../providers';

/**
 * Generated class for the OrgGroupsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-org-groups',
  templateUrl: 'org-groups.html',
})
export class OrgGroupsPage {

  organization: SubOrganization;
  subOrgGroups: any;
  subOrgPeople: any;
  constructor(
    private alert: AlertController,
    private firebase: FirebaseProvider,
    private navCtrl: NavController,
    private navParams: NavParams,
    private toast: ToasterProvider
  ) {
    this.organization = this.navParams.get('SubOrg');
    this.firebase.organizationInfo(this.organization.$key).then(info => {
      this.subOrgGroups = info[0];
      this.subOrgPeople = info[1];
    });
  }

  addPerson() {
    let prompt = this.alert.create({
      title: 'New Person',
      inputs: [
        {
          name: 'first_name',
          placeholder: 'First Name'
        },
        {
          name: 'last_name',
          placeholder: 'Last Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Add',
          handler: data => {
            if (data.first_name === '' || data.last_name === '') this.toast.showToast('Please fill out both fields');
            let person: Person = {
              firstName: data.first_name,
              lastName: data.last_name
            }
            this.subOrgPeople.push(person).then(_ => {
              this.toast.showToast(`Person added to ${this.organization.title}`);
            });
          }
        }
      ]
    });
    prompt.present();
  }

  addGroup() {
    let prompt = this.alert.create({
      title: 'New Group',
      inputs: [
        {
          name: 'group_title',
          placeholder: 'Group Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Add',
          handler: data => {
            if (data.group_title === '') this.toast.showToast('Group must have a name');
            this.firebase.createGroup(this.organization.$key, data.group_title).then(_ => {
              this.toast.showToast(`Group created for ${this.organization.title}`);
            });
          }
        }
      ]
    });
    prompt.present();
  }

}
