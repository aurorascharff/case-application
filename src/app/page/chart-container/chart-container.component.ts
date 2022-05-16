import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentService } from 'src/app/shared/services/content.service';
import { CompanyModel } from 'src/app/shared/models/CompanyModel';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css']
})
export class ChartContainerComponent implements OnInit, OnDestroy {

  private companies: CompanyModel[] = [];
  private values: { [industrycode: string]: number; } = {};
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  public chartInput: (string | number)[][] = [];

  constructor(private contentService: ContentService) { }

  /**
   * On init, set up the chartData stream for listening in our container
   * (data processing) component. Allow the subscribtion to last until unsub.
   * Let companies be the chartData recieved. Then, trigger data load from json
   * file in the service.
   */
  ngOnInit(): void {
    this.contentService.chartData$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.companies = data;
      this.processData(data);
    });
    this.contentService.getData();
  }

  /**
   * On destroy, unsub to the data stream to avoid data transfer
   * of unused data.
   */
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Process list of companies by yearly results, add by industry,
   * generate and update input for child component.
   * @param data all companies to process
   */
  processData(data: CompanyModel[]) {
    this.values = {};
    const output: (string | number)[][] = [];

    data.forEach(element => {
      if (this.values[element.beskrivelse] == null) {
        this.values[element.beskrivelse] = element.årsresultat;
      } else {
        this.values[element.beskrivelse] += element.årsresultat;
      }
    });

    Object.entries(this.values).forEach((key => {
      const graphItem = [key[0], key[1]];
      output.push(graphItem);
    }));
    this.chartInput = output;
  }

  /**
   * Filters chart container component for companies with yearly results
   * above given amount
   * @param maxResult maximum yearly result
   */
  filter(maxResult: number) {
    this.chartInput = [];
    const filteredCompanies: CompanyModel[] = [];

    this.companies.forEach(element => {
      if (element.årsresultat <= maxResult) {
        filteredCompanies.push(element);
      }
    });
    this.processData(filteredCompanies);
  }
}
