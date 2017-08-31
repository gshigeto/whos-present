import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrganizationDetailsPage } from './organization-details';

@NgModule({
  declarations: [
    OrganizationDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(OrganizationDetailsPage),
  ],
  entryComponents: [
    OrganizationDetailsPage
  ]
})
export class OrganizationDetailsPageModule { }
