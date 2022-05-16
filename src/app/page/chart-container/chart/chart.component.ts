import { Component, OnInit, ChangeDetectionStrategy, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
  })
export class ChartComponent implements OnInit, OnChanges {

  @Input() chartInput: number[][];

  /**
   * Highcharts component setup.
   */
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    title: {
      text: 'Årsresultat for bedrifer summert på bransjer'
    },
    series: [{
      name: 'Årsresultat',
      type: 'bar',
      data: this.chartInput
    }]
  };

  updateFlag = false;

  constructor() { }

  ngOnInit(): void {

  }

  /**
   * When changes on graph input variable (detected by changeDetectionStrategy.OnPush),
   * render the new data to graph.
   * @param changes changes on component input variables
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.chartInput != null && changes.chartInput.currentValue != null) {
      this.renderData();
    }
  }

  /**
   * Renders new data to the highchart chart.
   */
  renderData() {
    this.chartOptions.
    series = [{
      name: 'Årsresultat',
      color: 'darkblue',
      data: this.chartInput,
      type: 'bar',
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      }
    }];
    this.updateFlag = true;
  }

}
