import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { CompanyModel } from '../models/CompanyModel';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private datapath = '../../../assets/utrekk.json';

  /**
   * Datasource setup. Creates subject list for data and sets up data
   * stream from this as observable.
   */
  private chartDataSubject: Subject<CompanyModel[]> = new Subject<CompanyModel[]>();
  public chartData$: Observable<CompanyModel[]> = this.chartDataSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Gets data from the JSON file and fills the chartData stream.
   */
  getData() {
    this.http.get<CompanyModel[]>(this.datapath).subscribe((response) => {
      this.chartDataSubject.next(response);
    });
  }

}
