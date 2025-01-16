import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/security/auth.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  username: string;
  email: string;
  fullname: string;
  userroles: string[];

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.username = this.authService.user.profile.preferred_username;
      this.fullname = this.authService.user.profile.name;
      this.email = this.authService.user.profile.email;
      this.userroles = this.authService.getRoles();
    }
  }

  logout() {
    this.authService.logout();
  }

}
