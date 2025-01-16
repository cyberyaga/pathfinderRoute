import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    //Store url for callback
    sessionStorage.setItem("currentUrl", state.url);

    if (this.authService.isLoggedIn()) {
      let roles: string[] = this.authService.getRoles();

      //If current Route has roles specified
      if (route.data.expectedRole) {
        //console.log(route.data.expectedRole);
        let hasAccess: boolean = false;

        //Validate Roles
        roles.forEach(role => {
          if (route.data.expectedRole.includes(role)) {
            hasAccess = true;
          }
        });

        //respond if it has access
        if (!hasAccess) {
          this.router.navigate(['/errors/accessdenied']);
          return false;
        }
      }

      return true;
    }

    this.authService.startAuthentication();
    return false;
  }
}
