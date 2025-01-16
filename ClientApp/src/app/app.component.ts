import { Component } from '@angular/core';
import { AuthService } from './services/security/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isCollapsed = true;
  userName = "";
  fullName = "";

  constructor(
    public authService: AuthService) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.userName = this.authService.user.profile.preferred_username;
      this.fullName = this.authService.user.profile.name;
    }
  }

  logUserIn() {
    this.authService.startAuthentication();
  }
}
