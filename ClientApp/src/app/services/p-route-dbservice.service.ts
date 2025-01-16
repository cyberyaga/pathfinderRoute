import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

import { Customer } from '../models/customer';
import { CustomerAddress } from '../models/customer-address';
import { driver } from '../models/driver';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PRouteDbserviceService {

  private url = 'api/';
  private messageService: MessageService;


  constructor(private http: HttpClient) { }


  getAll(): Observable<any> {
    return this.http.get<Customer[]>(this.url)
      .pipe(
        tap(heroes => this.log(`fetched Customer Data`)),
        catchError(this.handleError('getCustomerData', []))
      );
  }


  get(term: string): Observable<any> {
    let url = '';
    if (!term.trim()) {
      url = this.url + 'CustomerData/GetCustomers';
    } else {
      url = this.url + 'CustomerData/GetCustomers/?term=' + term;
    }

    return this.http.get<Customer[]>(url)
      .pipe(
        tap(heroes => this.log(`fetched Customer Data`)),
        catchError(this.handleError('getCustomerData', []))
      );
  }

  /** Log a message with the MessageService */
  private log(message: string) {
    this.messageService.add('pRouteDBService: ' + message);
  }
  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
