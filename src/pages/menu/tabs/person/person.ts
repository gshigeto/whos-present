import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { FirebaseProvider } from '../../../../providers';


/**
 * Generated class for the PersonPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-person',
  templateUrl: 'person.html',
})
export class PersonPage {

  data = [];
  view = [];
  colorScheme = {
    domain: ['#5AA454', '#A10A28']
  };

  attendance = [];
  personObject: any;
  person: any;

  constructor(private firebase: FirebaseProvider, public navCtrl: NavController, public navParams: NavParams, private platform: Platform) {
    this.attendance = [];
    this.view = [this.platform.width(), this.platform.height() / 2];
    this.personObject = this.navParams.get('person');
    this.person = this.firebase.getPerson(this.personObject.$key);
    this.person.subscribe(person => {
      for (var key in person.attendance) {
        this.firebase.getAttendanceInformation(person.organization, key).subscribe(info => {
          info.attended = person.attendance[info.$key];
          this.attendance.push(info);
        });
      }
      this.data.push({ name: 'Present', value: person.timesPresent }, { name: 'Absent', value: person.timesAbsent });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonPage');
  }

  onSelect(event) {
    console.log(event);
  }

}
