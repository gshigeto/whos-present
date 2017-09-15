import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { FirebaseKeyValue } from '../../../../models';
import { FirebaseProvider, GoogleAnalyticsProvider } from '../../../../providers';

import { OrganizationReportPage } from '../organization-report/organization-report';
/**
 * Generated class for the ReportsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {

  userOrganizations: any;

  constructor(
    private firebase: FirebaseProvider,
    private ga: GoogleAnalyticsProvider,
    public navCtrl: NavController) {
    this.userOrganizations = this.firebase.userOrganizations();
  }

  ionViewDidEnter() {
    this.ga.trackView('Reports')
  }

  reports(organization: FirebaseKeyValue) {
    this.navCtrl.push(OrganizationReportPage, { organization: organization })
  }

}
