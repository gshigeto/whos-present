import { Component, Input } from '@angular/core';
import { Platform } from 'ionic-angular';

/**
 * Generated class for the PieChartComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'pie-chart',
  templateUrl: 'pie-chart.html'
})
export class PieChartComponent {

  @Input('data') data: Array<any>;
  @Input('view') view: number;
  colorScheme = {
    domain: ['#5AA454', '#A10A28']
  };

  constructor(private platform: Platform) {
  }

  onSelect(event) {
    console.log(event);
  }

}
