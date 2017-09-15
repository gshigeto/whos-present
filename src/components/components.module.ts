import { NgModule } from '@angular/core';
import { PieChartComponent } from './pie-chart/pie-chart';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LineChartComponent } from './line-chart/line-chart';

@NgModule({
  declarations: [PieChartComponent,
    LineChartComponent],
  imports: [NgxChartsModule],
  exports: [PieChartComponent,
    LineChartComponent]
})
export class ComponentsModule { }
