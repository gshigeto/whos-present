import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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
  organization: any;
  groupPeople: any;
  people: any;
  type: string;

  constructor(
    private alert: AlertController,
    private firebase: FirebaseProvider,
    private ga: GoogleAnalyticsProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    this.group = this.navParams.get('group');
    this.organization = this.navParams.get('organization');
    this.firebase.groupPeople(this.group.$key).subscribe(groupPeople => {
      this.firebase.organizationPeople(this.organization.$key).subscribe(orgPeople => {
        this.people = orgPeople;
        this.people.forEach(person => {
          let test = groupPeople.some(groupPerson => groupPerson.$key === person.$key);
          if (test) person.checked = true;
        });
      });
    });
  }

  ionViewDidEnter() {
    this.ga.trackView('Group Details');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  check(person: any) {
    if (person.checked) this.firebase.addGroupPerson(this.group.$key, person)
    else this.firebase.deleteGroupPerson(this.group.$key, person.$key);
  }

}
