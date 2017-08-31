import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { GroupDetailsPage } from '../group-details/group-details'
import { PersonPage } from '../person/person';

import { FirebaseProvider, ToasterProvider } from '../../../../providers';

/**
 * Generated class for the OrgGroupsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-organization-details',
  templateUrl: 'organization-details.html',
})
export class OrganizationDetailsPage {

  type: string = 'groups';
  organization: any;
  organizationGroups: any;
  organizationPeople: any;
  constructor(
    private alert: AlertController,
    private firebase: FirebaseProvider,
    private navCtrl: NavController,
    private navParams: NavParams,
    private toast: ToasterProvider
  ) {
    this.organization = this.navParams.get('organization');
    this.firebase.organizationEntities(this.organization.$key).then(organizationEntities => {
      this.organizationGroups = organizationEntities[0];
      this.organizationPeople = organizationEntities[1];
    });
  }

  create(): void {
    if (this.type === 'groups') this.addGroup();
    else this.addPerson();
  }

  groupDetails(group: any) {
    this.navCtrl.push(GroupDetailsPage, { group: group });
  }

  private addGroup(): void {
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
            if (data.group_title === '') {
              this.toast.showToast('Group must have a name');
              return;
            }
            this.firebase.createGroup(this.organization.$key, data.group_title);
          }
        }
      ]
    });
    prompt.present();
  }

  private addPerson(): void {
    let prompt = this.alert.create({
      title: 'New Person',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Add',
          handler: data => {
            if (data.name === '') {
              this.toast.showToast('Person needs a name');
              return;
            }
            this.firebase.createPerson(this.organization.$key, data.name);
          }
        }
      ]
    });
    prompt.present();
  }

  personDetails(person: any) {
    this.navCtrl.push(PersonPage, { person: person });
  }

}
