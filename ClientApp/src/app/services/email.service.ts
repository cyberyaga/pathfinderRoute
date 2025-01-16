import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from './security/auth.service';
import { environment } from '../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class EmailService {

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  sendPasswordReset(userId: string): Observable<string> {
    let params = new HttpParams()
    .set("userId", userId);
    let head = new HttpHeaders({ 'Authorization': this.authService.getAuthorizationHeaderValue() });
    // console.log(userId);

    return this.http.get<string>(environment.apiURL + 'Accounts/SendPasswordReset', { headers: head, params: params });
  }
}