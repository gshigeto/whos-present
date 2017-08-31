import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Person, SubGroup, SubOrganization } from '../../../../models';

import { FirebaseProvider, GoogleAnalyticsProvider, ToasterProvider } from '../../../../providers';

/**
 * Generated class for the HomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  selectedOrg: SubOrganization;
  selectedGroup: any;
  selectedPeople: Array<any>;
  orgGroups: any;
  orgPeople: any;
  allOrgPeople: any;
  description: string;

  constructor(
    private alert: AlertController,
    private firebase: FirebaseProvider,
    private ga: GoogleAnalyticsProvider,
    private loading: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toast: ToasterProvider
  ) {
  }

  ionViewDidEnter() {
    this.ga.trackView('Home');
    this.erase();
  }

  erase() {
    this.selectedOrg = null;
    this.selectedGroup = null;
    this.selectedPeople = null;
    this.orgGroups = null;
    this.orgPeople = null;
    this.allOrgPeople = null;
    this.description = null;
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

  organizationSelected() {
    if (this.selectedOrg) {
      this.orgGroups = null;
      this.orgPeople = null;
      this.firebase.organizationEntities(this.selectedOrg.$key).then(organizationEntities => {
        this.orgGroups = organizationEntities[0];
        this.allOrgPeople = organizationEntities[1];
      });
    }
  }

  groupSelected() {
    if (this.selectedGroup === 'none') this.orgPeople = this.allOrgPeople;
    else this.orgPeople = this.firebase.groupPeople(this.selectedGroup.$key);
  }

  createPerson() {
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
            this.firebase.createPerson(this.selectedOrg.$key, data.name);
          }
        }
      ]
    });
    prompt.present();
  }

  takeRoll() {
    let loader = this.loading.create({
      content: "Saving Attendance..."
    })
    loader.present();
    this.orgPeople.subscribe(people => {
      let attendance = [];
      people.forEach(person => {
        for (var i = 0; this.selectedPeople && i < this.selectedPeople.length; i++) {
          if (this.selectedPeople[i].$key === person.$key) {
            person.present = true;
            break;
          }
        }
        attendance.push(person);
      });
      this.firebase.takeAttendance(this.selectedOrg.$key, attendance, this.description).then(_ => {
        loader.dismiss();
        this.toast.showToast(`Attendance Saved!`);
        this.erase();
      });
    }).unsubscribe();
  }

}
