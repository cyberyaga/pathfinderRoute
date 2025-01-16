import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Route } from '../models/route';
import { CustomerPickup } from '../models/customerpickup';
import { AuthService } from './security/auth.service';
import { routeday } from '../models/routeday';
import { boundary } from '../models/boundary';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class RouteDataService {


  private url = 'api/';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private messageService: MessageService) { }

  getRoutePickupDates(): Observable<Date[]> {
    let head = new HttpHeaders({ 'Authorization': this.authService.getAuthorizationHeaderValue() });

    return this.http.get<Date[]>(this.url + 'RouteData/GetRouteDatesWithPickups', { headers: head });

  }


  getRoutes(routedate: Date, includeAll: boolean = false, assignedDriverId: number = null): Observable<Route[]> {
    let head = new HttpHeaders({ 'Authorization': this.authService.getAuthorizationHeaderValue() });

    let params = new HttpParams()
      .set("routedate", routedate.toDateString())
      .set("includeall", includeAll ? "true" : "false")
      .set("AssignedDriverId", assignedDriverId ? assignedDriverId.toString() : "");

    return this.http.get<Route[]>(this.url + 'RouteData/GetRoutes', { headers: head, params: params });
    // .pipe(
    //   tap(heroes => this.log(`fetched Pending Routes Data`)),
    //   catchError(this.handleError('getRoutes', []))
    // );
  }

  getRoute(routeId: number): Observable<Route> {
    let params = new HttpParams()
      .set("routeid", routeId.toString());

    return this.http.get<Route>(this.url + 'RouteData/GetRoute', { params: params });
  }

  getBoundaries(routeId: number = 0, withCoord: boolean = false): Observable<boundary[]> {
    let head = new HttpHeaders({ 'Authorization': this.authService.getAuthorizationHeaderValue() });

    let params = new HttpParams()
      .set("routeId", routeId.toString())
      .set("withCoord", withCoord ? "true" : "false");

    return this.http.get<boundary[]>(this.url + 'RouteData/GetBoundaries', { headers: head, params: params });
  }

  updateBoundary(b: boundary): Observable<boundary> {
    return this.http.post<boundary>(this.url + 'RouteData/UpdateBoundary', b, httpOptions);
  }

  getRoutePickups(routeId: number, routedate: Date): Observable<CustomerPickup[]> {
    let params = new HttpParams()
      .set("routeid", routeId.toString())
      .set("routedate", routedate.toDateString());

    return this.http.get<CustomerPickup[]>(this.url + 'RouteData/GetRoutePickups', { params: params });
    // .pipe(
    //   tap(heroes => this.log(`fetched Pending Routes Data`)),
    //   catchError(this.handleError('CustomerPickup', null))
    // );
  }

  moveRoutePickup(pickupId: number, routeId: number, routeDate: Date): Observable<CustomerPickup[]> {
    let params = new HttpParams()
      .set("pickupId", pickupId.toString())
      .set("routeid", routeId.toString())
      .set("routedate", routeDate.toDateString());

    return this.http.post<CustomerPickup[]>(this.url + 'RouteData/MoveRoutePickup', { params: params });
    // .pipe(
    //   tap(heroes => this.log(`fetched Pending Routes Data`)),
    //   catchError(this.handleError('CustomerPickup', null))
    // );
  }

  addRoute(route: Route): Observable<Route> {
    return this.http.post<Route>(this.url + 'RouteData/AddRoute', route, httpOptions);
  }


  updateRoute(route: Route): Observable<Route> {
    return this.http.put<Route>(this.url + 'RouteData/UpdateRoute', route, httpOptions);
  }

  updateRouteDay(route: routeday): Observable<routeday> {
    return this.http.post<routeday>(this.url + 'RouteData/UpdateRouteDay', route, httpOptions);
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
