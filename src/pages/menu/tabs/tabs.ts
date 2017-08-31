import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { FirebaseProvider } from '../../../providers';

/**
 * Generated class for the TabsPage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  homeRoot = 'HomePage'
  organizationsRoot = 'OrganizationsPage'
  groupsRoot = 'GroupsPage'


  constructor(private firebase: FirebaseProvider) { }

}
