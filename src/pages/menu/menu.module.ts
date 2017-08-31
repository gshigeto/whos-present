import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuPage } from './menu';
import { TabsPageModule } from './tabs/tabs.module';

@NgModule({
  declarations: [
    MenuPage,
  ],
  imports: [
    TabsPageModule,
    IonicPageModule.forChild(MenuPage),
  ]
})
export class MenuPageModule { }
