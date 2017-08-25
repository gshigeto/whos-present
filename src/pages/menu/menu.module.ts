import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuPage } from './menu';
import { GroupsPageModule } from './groups/groups.module';
import { OrganizationsPageModule } from './organizations/organizations.module';
import { OrgGroupsPageModule } from './organizations/org-groups/org-groups.module';
import { ReportsPageModule } from './reports/reports.module';
import { SettingsPageModule } from './settings/settings.module';

@NgModule({
  declarations: [
    MenuPage,
  ],
  imports: [
    GroupsPageModule,
    OrganizationsPageModule,
    OrgGroupsPageModule,
    ReportsPageModule,
    SettingsPageModule,
    IonicPageModule.forChild(MenuPage),
  ],
})
export class MenuPageModule { }
