import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './security/auth.service';
import { environment } from '../../environments/environment';
import { PasswordReset } from '../models/passwordreset';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserPreferenceService {

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  resetPassword(pwdObj: PasswordReset): Observable<string> {
    return this.http.post<string>(environment.apiURL + 'Accounts/ResetPassword', pwdObj);
  }
}