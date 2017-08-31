import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonPage } from './person';

import { ChartsModule } from 'ng2-charts/ng2-charts';

@NgModule({
  declarations: [
    PersonPage,
  ],
  imports: [
    ChartsModule,
    IonicPageModule.forChild(PersonPage),
  ],
})
export class PersonPageModule { }
