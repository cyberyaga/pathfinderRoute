import { Component, OnInit, TemplateRef } from '@angular/core';
import { AdminDataService } from '../../../services/admin-data.service';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { User } from '../../../models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmailService } from 'src/app/services/email.service';


@Component({
  selector: 'app-usermanager',
  templateUrl: './usermanager.component.html',
  styleUrls: ['./usermanager.component.css']
})
export class UsermanagerComponent implements OnInit {
  users: User[];
  currentUser: User = null;
  modalRef: ModalDirective;

  //Form
  form = new FormGroup({
    userName: new FormControl('', Validators.required),
    eMail: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    isAdmin: new FormControl(),
    isRouteManager: new FormControl(),
    isDispatcher: new FormControl(),
    isDriver: new FormControl()
  });

  constructor(
    private adminData: AdminDataService,
    private modalService: BsModalService,
    private emailService: EmailService
  ) { }

  ngOnInit() {

    this.adminData.getUsers().subscribe(result => {
      this.users = result;
    });
  }

  openModal(template: ModalDirective, u: User) {
    this.modalRef = template;
    this.loadUser(u);

    template.show();
  }

  loadUser(u: User) {
    this.currentUser = u;
    this.form.reset();

    if (this.currentUser != null) {
      this.form.patchValue({
        userName: u.userName,
        eMail: u.email,
        firstName: u.firstName,
        lastName: u.lastName
      });

      //Set Roles
      let roles = u.roles.split(',');

      for (let r of roles) {
        if (r != "") {
          let f = this.form.get('is' + r.replace(' ', '')) as FormControl;
          f.setValue(true);
        }
      }
    }
  }

  submit(f) {
    let u: User;
    if (this.currentUser != null) {
      u = this.currentUser;
    }
    else {
      u = new User();
    }
    u.userName = f.userName;
    u.email = f.eMail;
    u.firstName = f.firstName;
    u.lastName = f.lastName;

    let roles: string[] = [];

    if (f.isAdmin) {
      roles.push("Admin");
    }
    if (f.isDispatcher) {
      roles.push("Dispatcher");
    }
    if (f.isDriver) {
      roles.push("Driver");
    }
    if (f.isRouteManager) {
      roles.push("Route Manager");
    }

    u.roles = roles.join(',');

    if (this.currentUser != null) {
      //Submit data
      this.adminData.updateUser(u).subscribe(result => {
        this.modalRef.hide();
      });
    }
    else {
      //Submit Data
      this.adminData.createUser(u).subscribe(r => {
        this.adminData.getUsers().subscribe(result => {
          this.users = result;
          this.modalRef.hide();
        });
      });
    }
  }

  sendPasswordReset(userId: string){
    this.emailService.sendPasswordReset(userId).subscribe(rest => {
      // console.log(rest);
    });
  }
}
