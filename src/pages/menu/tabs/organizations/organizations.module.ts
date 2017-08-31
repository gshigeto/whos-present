import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrganizationsPage, OrganizationPopover } from './organizations';

@NgModule({
  declarations: [
    OrganizationsPage,
    OrganizationPopover
  ],
  imports: [
    IonicPageModule.forChild(OrganizationsPage),
  ],
  entryComponents: [
    OrganizationsPage,
    OrganizationPopover
  ]
})
export class OrganizationsPageModule { }
