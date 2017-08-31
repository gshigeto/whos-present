import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { FirebaseProvider, GoogleAnalyticsProvider } from '../../../../providers';

/**
 * Generated class for the GroupDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-details',
  templateUrl: 'group-details.html',
})
export class GroupDetailsPage {

  group: any;
  groupPeople: any;
  allOrganizationPeople: any;
  type: string;

  constructor(
    private alert: AlertController,
    private firebase: FirebaseProvider,
    private ga: GoogleAnalyticsProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.group = this.navParams.get('group');
    this.groupPeople = this.firebase.groupPeople(this.group.$key);
    let subscription = this.firebase.groupInformation(this.group.$key).subscribe(group => {
      subscription.unsubscribe();
      this.allOrganizationPeople = this.firebase.organizationPeople(group.organization);
    });
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad GroupDetailsPage');
  }

  addPeople() {
    let alert = this.alert.create();
    alert.setTitle('Who belongs to this group?');
    this.allOrganizationPeople.subscribe(people => {
      people.forEach(person => {
        alert.addInput({
          type: 'checkbox',
          label: `${person.$value}`,
          value: person
        });
      });
      alert.addButton('Cancel');
      alert.addButton({
        text: 'Save',
        handler: data => {
          this.firebase.addGroupPeople(this.group.$key, data);
        }
      });
      alert.present();
    });
  }

}
