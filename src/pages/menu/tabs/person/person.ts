import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  public doughnutChartLabels: string[] = ['Present', 'Absent'];
  public doughnutChartData: number[] = [];
  public doughnutChartType: string = 'doughnut';

  personObject: any;
  person: any;
  constructor(private firebase: FirebaseProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.personObject = this.navParams.get('person');
    this.person = this.firebase.getPerson(this.personObject.$key);
    let subscription = this.person.subscribe(person => {
      subscription.unsubscribe();
      this.doughnutChartData = [person.timesPresent, person.timesAbsent]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonPage');
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
