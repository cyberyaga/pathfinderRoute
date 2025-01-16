import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class VehicleDataService {

  private url = 'api/';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }


  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(this.url + 'VehicleData/GetVehicles')
      .pipe(
        tap(heroes => this.log(`fetched Pending Vehicle Data`)),
        catchError(this.handleError('getVehicles', []))
      );
  }

  addVehicleData(cust: Vehicle) {
    return this.http.post(this.url + 'VehicleData/AddVehicle', cust, httpOptions)
      .pipe(
        tap(heroes => this.messageService.log(`Added Vehicle Data`)),
        catchError(this.messageService.handleError('addVehicleData', []))
      );
  }

  updateVehicleData(cust: Vehicle) {
    return this.http.post(this.url + 'VehicleData/UpdateVehicle', cust, httpOptions)
      .pipe(
        tap(heroes => this.messageService.log(`Updated Vehicle Data`)),
        catchError(this.messageService.handleError('updateVehicleData', []))
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
