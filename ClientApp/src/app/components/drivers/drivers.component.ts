import { Component, OnInit, ViewChild } from '@angular/core';
import { driver } from '../../models/driver';
import { DriverDataService } from '../../services/driver-data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent implements OnInit {
  //Modal
  @ViewChild('driverModal') driverModal: ModalDirective;

  public drivers: driver[];
  public currentDriver: driver;

  //form
  form = new FormGroup({
    driverId: new FormControl(),
    driverFirstName: new FormControl('', Validators.required),
    driverLastName: new FormControl('', Validators.required)
  });

  constructor(
    private driverData: DriverDataService) { }

  ngOnInit() {
    //initial Load
    this.loadDrivers();
  }

  loadDrivers(){
    this.driverData.getDriversData("").subscribe(result => {
      this.drivers = result;
      this.currentDriver = null;
    });
  }

  selectDriver(d: driver){
    this.currentDriver = d;
  }

  showDriverDialog(d: driver){
    this.loadForm(d);
    this.driverModal.show();
  }

  loadForm(d: driver) {
    if (d) {
      this.form.patchValue({
        driverId: d.id,
        driverFirstName: d.firstName,
        driverLastName: d.lastName
      });
    } else {
      this.form.reset();
    }
  }

  formtodriver(f): driver {
    let d = new driver();
    
    d.id = (f.driverId == null) ? 0 : f.driverId;
    d.firstName = f.driverFirstName;
    d.lastName = f.driverLastName;

    return d;
  }

  submitDriverData(f){

    let d = this.formtodriver(f);

    if (d.id !== 0) { // Update
      this.driverData.updateDriverData(d).subscribe(res => {
        // close form
        this.driverModal.hide();
        this.loadDrivers();
      });
    } else {
      // Insert
      this.driverData.addDriverData(d).subscribe(res => {
        // close form
        this.driverModal.hide();
        this.loadDrivers();
      });
    }
  }
}
