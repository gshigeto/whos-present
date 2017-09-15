import { Component, Input } from '@angular/core';
import { Platform } from 'ionic-angular';

/**
 * Generated class for the LineChartComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'line-chart',
  templateUrl: 'line-chart.html'
})
export class LineChartComponent {

  @Input('data') data: Array<any>;
  view: Array<number> = []
  colorScheme = {
    domain: ['#5AA454', '#A10A28']
  };

  constructor(private platform: Platform) {
    this.view.push(this.platform.width());
  }

  onSelect(event) {
    console.log(this.data);
  }

}
