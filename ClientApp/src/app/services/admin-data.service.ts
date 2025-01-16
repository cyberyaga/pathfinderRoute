import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AuthService } from './security/auth.service';
import { environment } from '../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AdminDataService {

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  getUsers(): Observable<User[]> {
    let head = new HttpHeaders({ 'Authorization': this.authService.getAuthorizationHeaderValue() });

    return this.http.get<User[]>(environment.apiURL + 'Accounts/GetUsers', { headers: head });
  }

  showUser() {
    let head = new HttpHeaders({ 'Authorization': this.authService.getAuthorizationHeaderValue() });
    return this.http.get(environment.apiURL + 'Accounts/GetUserClaims', { headers: head });
  }

  createUser(u: User){
    let head = new HttpHeaders({ 'Authorization': this.authService.getAuthorizationHeaderValue() });
    return this.http.post<User>(environment.apiURL + 'Accounts/CreateUser', u, { headers: head });
  }

  updateUser(u: User){
    let head = new HttpHeaders({ 'Authorization': this.authService.getAuthorizationHeaderValue() });
    return this.http.put<User>(environment.apiURL + 'Accounts/UpdateUser', u, { headers: head });
  }
}
