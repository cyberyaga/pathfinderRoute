import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {

  private manager = new UserManager(getClientSettings());
  public user: User = null;
  constructor(private router: Router) {
    this.manager.getUser().then(user => {
      this.user = user;
    });
  }

  isLoggedIn(): boolean {
    return this.user != null && !this.user.expired;
  }
  getClaims(): any {
    return this.user.profile;
  }

  getRoles(): string[] {
    let rolesStr = this.user.profile["role"] + "";
    if (rolesStr != null) {
      return rolesStr.split(",");
    }
    else {
      let arr: string[] = [];
      return arr;
    }
  }

  getAuthorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect();
  }

  completeAuthentication(): Promise<void> {
    return this.manager.signinRedirectCallback().then(user => {
      this.user = user;

      //Redirect User
      this.router.navigateByUrl(sessionStorage.getItem("currentUrl"));
    });
  }

  logout(): Promise<void> {
    return this.manager.signoutRedirect();
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: environment.authURL,
    client_id: 'spa',
    redirect_uri: environment.currentUrl + '/auth-callback',
    post_logout_redirect_uri: environment.currentUrl + '/auth-logout',
    response_type: "id_token token",
    scope: "openid profile api1 email role",
    filterProtocolClaims: true,
    loadUserInfo: true
  };
}