import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MessageService } from './message.service';
import { CustomerPickup } from '../models/customerpickup';
import { Pickup } from '../models/pickup';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class PickupDataService {


  private url = 'api/';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getPendingPickups(): Observable<CustomerPickup[]> {
    return this.http.get<CustomerPickup[]>(this.url + 'PickUpData/GetPendingPickups')
      .pipe(
        tap(heroes => this.log(`fetched Pending PickUp Data`)),
        catchError(this.handleError('getPendingPickups', []))
      );
  }

  getAssignedPickups(): Observable<CustomerPickup[]> {
    return this.http.get<CustomerPickup[]>(this.url + 'PickUpData/GetAssignedPickups')
      .pipe(
        tap(heroes => this.log(`fetched Assigned PickUp Data`)),
        catchError(this.handleError('GetAssignedPickups', []))
      );
  }
  getPickedUpPickups(): Observable<CustomerPickup[]> {
    return this.http.get<CustomerPickup[]>(this.url + 'PickUpData/GetRecentPickups')
      .pipe(
        tap(heroes => this.log(`fetched Recent PickUp Data`)),
        catchError(this.handleError('getPickedUpPickups', []))
      );
  }
  getCancelledPickups(): Observable<CustomerPickup[]> {
    return this.http.get<CustomerPickup[]>(this.url + 'PickUpData/GetRecentCancels')
      .pipe(
        tap(heroes => this.log(`fetched Cancelled PickUp Data`)),
        catchError(this.handleError('getCancelledPickups', []))
      );
  }
  getCompletedPickups(): Observable<CustomerPickup[]> {
    return this.http.get<CustomerPickup[]>(this.url + 'PickUpData/GetRecentCompleted')
      .pipe(
        tap(heroes => this.log(`fetched Completed PickUp Data`)),
        catchError(this.handleError('getCompletedPickups', []))
      );
  }

  addCustomerPickupData(custpick: Pickup): Observable<Pickup> {
    console.log(custpick);
    return this.http.post<Pickup>(this.url + 'PickUpData/AddCustomerPickup', custpick, httpOptions)
      .pipe(
        tap(heroes => this.log(`added Customer pickup Data`)),
        catchError(this.handleError('addCustomerPickupData', custpick))
      );
  }

  cancelCustomerPickupData(pickupId: number): Observable<{}> {
    return this.http.post(this.url + 'PickUpData/CancelCustomerPickup', { PickupId: pickupId }, httpOptions)
      .pipe(
        tap(heroes => this.log(`added Customer pickup Data`)),
        catchError(this.handleError('cancelCustomerPickupData', []))
      );
  }

  moveCustomerPickupData(pickupId: number, routeId: number, routeDate: Date): Observable<{}> {
    return this.http.post(this.url + 'PickUpData/MoveCustomerPickup', {pickupId:pickupId,routeId:routeId,RouteDate:routeDate}, httpOptions)
      .pipe(
        tap(heroes => this.log(`added Customer pickup Data`)),
        catchError(this.handleError('moveCustomerPickupData', []))
      );
  }

  confirmCustomerPickup(pickupId: number): Observable<{}> {
    const url = `${this.url + 'PickUpData/ConfirmCustomerPickup'}/${pickupId}`; // Confirm
    return this.http.delete(url, httpOptions)
      .pipe(
        tap(heroes => this.log(`added Customer pickup Data`)),
        catchError(this.handleError('confirmCustomerPickupData', []))
      );
  }

  cancelCustomerPickup(pickupId: number): Observable<{}> {
    const url = `${this.url + 'PickUpData/CancelCustomerPickup'}/${pickupId}`; // Confirm
    return this.http.delete(url, httpOptions)
      .pipe(
        tap(heroes => this.log(`cancelled Customer pickup Data`)),
        catchError(this.handleError('CancelCustomerPickup', []))
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
