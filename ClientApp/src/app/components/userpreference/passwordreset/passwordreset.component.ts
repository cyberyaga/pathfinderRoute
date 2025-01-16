import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPreferenceService } from 'src/app/services/user-preference.service';
import { PasswordReset } from 'src/app/models/passwordreset';
import { AuthService } from 'src/app/services/security/auth.service';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css']
})
export class PasswordresetComponent implements OnInit {
  resetErrMsg: string;
  form = this.fb.group({
    UserId: ['', [Validators.required]],
    password: ['', [Validators.required]],
    passwordConfirm: ['', [Validators.required]],
    token: ['', [Validators.required]]
  }, { validator: this.checkPasswords });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userPrefService: UserPreferenceService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    //Route ID Parameter
    this.route.queryParams.subscribe(params => {
      //this.currentRoute = +params.get('id');
      this.form.get("UserId").setValue(params['I']);
      this.form.get("token").setValue(params['token']);
    });
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.passwordConfirm.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  // (ngSubmit)="submit(form.value)"
  submit(form) {
    let pwd = new PasswordReset();
    pwd.userId = form.UserId;
    pwd.token = form.token;
    pwd.password = form.password;
    this.userPrefService.resetPassword(pwd).subscribe(result => {
      this.authService.logout();
      this.router.navigate(['/userpreference']);
    }, err => {
      this.resetErrMsg = err.error;
    });
  }
}
