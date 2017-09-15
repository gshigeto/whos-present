import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { FirebaseKeyValue } from '../../../../models';
import { FirebaseProvider, GoogleAnalyticsProvider } from '../../../../providers';
import { PersonPage } from '../person/person';

/**
 * Generated class for the OrganizationReportPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-organization-report',
  templateUrl: 'organization-report.html',
})
export class OrganizationReportPage {

  results = [];
  view = [];
  people: any;
  orgAttendanceLoaded: boolean = false;
  peopleLoaded: boolean = false;

  organization: FirebaseKeyValue;
  constructor(
    private firebase: FirebaseProvider,
    private ga: GoogleAnalyticsProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform
  ) {
    this.view = [this.platform.width(), (this.platform.width() / 2)];
    this.organization = this.navParams.get('organization');
    this.firebase.organizationAttendance(this.organization.$key).subscribe(attendance => {
      this.results = [];
      let data = {}
      attendance.forEach(occurence => {
        if (!(occurence.group in data)) data[occurence.group] = [];
        data[occurence.group].push({ name: occurence.created, value: (occurence.present / (occurence.present + occurence.absent)) * 100 })
      });

      for (let key in data) {
        this.results.push({ name: key, data: [{ name: key, series: data[key] }] });
      }

      this.orgAttendanceLoaded = true;
    });
    this.firebase.organizationPeople(this.organization.$key).subscribe(organizationPeople => {
      this.people = organizationPeople;
      this.people.forEach(person => {
        this.firebase.getPerson(person.$key).subscribe(individual => {
          person.attendance = [{ name: 'Present', value: individual.timesPresent }, { name: 'Absent', value: individual.timesAbsent }];
          person.percent = individual.timesPresent / (individual.timesPresent + individual.timesAbsent);
        });
      });
      this.peopleLoaded = true;
    });

  }

  ionViewDidEnter() {
    this.ga.trackView('Organization Report');
  }

  personDetails(person: any) {
    this.navCtrl.push(PersonPage, { person: person });
  }

}
