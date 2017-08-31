import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';

import { GroupDetailsPageModule } from './group-details/group-details.module';
import { OrganizationsPageModule } from './organizations/organizations.module';
import { OrganizationDetailsPageModule } from './organization-details/organization-details.module';
import { PersonPageModule } from './person/person.module';
import { ReportsPageModule } from './reports/reports.module';
import { SettingsPageModule } from './settings/settings.module';

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    GroupDetailsPageModule,
    OrganizationsPageModule,
    OrganizationDetailsPageModule,
    PersonPageModule,
    ReportsPageModule,
    SettingsPageModule,
    IonicPageModule.forChild(TabsPage),
  ],
  entryComponents: [
    TabsPage
  ]
})
export class TabsPageModule { }
