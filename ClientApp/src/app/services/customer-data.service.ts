import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Customer } from '../models/customer';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MessageService } from './message.service';
import { CustomerAddress } from '../models/customer-address';
import { CustomerPickup } from '../models/customerpickup';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CustomerDataService {

  private url = 'api/';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  // CUSTOMER Service
  getCustomerData(term: string): Observable<Customer[]> {
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

  getCustomerDatabyID(id: number): Observable<Customer[]> {
    let url = this.url + 'CustomerData/GetCustomer/?CustId=' + id.toString();

    return this.http.get<Customer[]>(url)
      .pipe(
        tap(heroes => this.log(`fetched Customer Data`)),
        catchError(this.handleError('getCustomerData', []))
      );
  }

  getCustomerPickups(custId: number): Observable<CustomerPickup[]>{
    let params = new HttpParams()
    .set("CustID", custId.toString())
    return this.http.get<CustomerPickup[]>(this.url + 'CustomerData/GetCustomerPickups', { params: params });
  }

  addCustomerData(cust: Customer) {
    return this.http.post(this.url + 'CustomerData/AddCustomer', cust, httpOptions)
      .pipe(
        tap(heroes => this.log(`Added Customer Data`)),
        catchError(this.handleError('addCustomerData', []))
      );
  }

  updateCustomerData(cust: Customer) {
    return this.http.post(this.url + 'CustomerData/UpdateCustomer', cust, httpOptions)
      .pipe(
        tap(heroes => this.log(`Updated Customer Data`)),
        catchError(this.handleError('updateCustomerData', []))
      );
  }

  // CUSTOMER ADDRESS Service
  getCustumerAddressDataList(CustomerId: number): Observable<CustomerAddress[]> {
    const url = this.url + 'CustomerAddressData/GetCustomerAddresses';
    const params = new HttpParams().set('CustomerId', CustomerId.toString());

    return this.http.get<CustomerAddress[]>(url, { params: params })
      .pipe(
        tap(heroes => this.log(`fetched Customers Address List`)),
        catchError(this.handleError('getCustumerAddressDataList', []))
      );
  }

  getCustumerAddressData(CustAddressID: number): Observable<CustomerAddress> {
    const url = this.url + 'CustomerAddressData/GetCustomerAddress';
    const params = new HttpParams().set('CustAddressID', CustAddressID.toString());

    return this.http.get<CustomerAddress>(url, { params: params })
      .pipe(
        tap(heroes => this.log(`fetched Customer Address`)),
        catchError(this.handleError<CustomerAddress>('getCustumerAddressData'))
      );
  }

  addCustomerAddressData(CustAddress: CustomerAddress): Observable<any> {
    return this.http.post(this.url + 'CustomerAddressData/AddCustomerAddress', CustAddress, httpOptions)
      .pipe(
        tap(heroes => this.log(`Added Customer Address Data`)),
        catchError(this.handleError('addCustomerAddressData', []))
      );
  }

  updateCustomerAddressData(CustAddress: CustomerAddress): Observable<any> {
    return this.http.post(this.url + 'CustomerAddressData/UpdateCustomerAddress', CustAddress, httpOptions)
      .pipe(
        tap(heroes => this.log(`Updated Customer Address Data`)),
        catchError(this.handleError('updateCustomerAddressData', []))
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
