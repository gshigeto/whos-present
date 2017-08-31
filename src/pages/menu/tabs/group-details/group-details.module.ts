import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupDetailsPage } from './group-details';

@NgModule({
  declarations: [
    GroupDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupDetailsPage),
  ],
})
export class GroupDetailsPageModule {}
