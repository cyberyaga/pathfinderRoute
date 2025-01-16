import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { driver } from '../models/driver';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DriverDataService {

  private url = 'api/';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

    // DRIVERS SERVICE
    getDriversData(term: string): Observable<driver[]> {
      let url = '';
      if (term.trim() == "") {
        url = this.url + 'DriverData/GetDrivers';
      } else {
        url = this.url + 'DriverData/SearchDrivers/?search=' + term;
      }
  
      return this.http.get<driver[]>(url)
        .pipe(
          tap(heroes => this.messageService.log(`fetched Drivers Data`)),
          catchError(this.messageService.handleError('getDriversData', []))
        );
    }
  
    searchDrivers(term: string): Observable<driver[]> {
      if (!term.trim()) {
        // if not search term, return empty hero array.
        return of([]);
      }
      return this.http.get<driver[]>(`api/SearchDrivers/?search=${term}`).pipe(
        tap(_ => this.messageService.log(`found Driver matching "${term}"`)),
        catchError(this.messageService.handleError<driver[]>('searchDrivers', []))
      );
    }
  
    addDriverData(cust: driver) {
      return this.http.post(this.url + 'DriverData/AddDriver', cust, httpOptions)
        .pipe(
          tap(heroes => this.messageService.log(`Added Driver Data`)),
          catchError(this.messageService.handleError('addDriverData', []))
        );
    }
  
    updateDriverData(cust: driver) {
      return this.http.post(this.url + 'DriverData/UpdateDriver', cust, httpOptions)
        .pipe(
          tap(heroes => this.messageService.log(`Updated Customer Data`)),
          catchError(this.messageService.handleError('updateDriverData', []))
        );
    }

}
