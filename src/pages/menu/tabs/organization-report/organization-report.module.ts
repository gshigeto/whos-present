import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrganizationReportPage } from './organization-report';

import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    OrganizationReportPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(OrganizationReportPage),
  ],
})
export class OrganizationReportPageModule { }
