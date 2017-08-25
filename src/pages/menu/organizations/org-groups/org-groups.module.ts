import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrgGroupsPage } from './org-groups';

@NgModule({
  declarations: [
    OrgGroupsPage,
  ],
  imports: [
    IonicPageModule.forChild(OrgGroupsPage),
  ],
  entryComponents: [
    OrgGroupsPage
  ]
})
export class OrgGroupsPageModule { }
