import { Component, OnInit, ViewChild } from '@angular/core';
import { Vehicle } from '../../models/vehicle';
import { VehicleDataService } from '../../services/vehicle-data.service';
import { DriverDataService } from '../../services/driver-data.service';
import { driver } from '../../models/driver';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LoadedRouterConfig } from '@angular/router/src/config';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  //Modal
  @ViewChild('vehicleModal') vehicleModal: ModalDirective;

  //model
  vehicles: Vehicle[];
  drivers: driver[];
  selectedVehicle: Vehicle;

  //form
  form = new FormGroup({
    vehicleId: new FormControl(),
    vehicleName: new FormControl('', Validators.required),
    capacity: new FormControl('', Validators.required),
    driver: new FormControl()
  });

  constructor(
    private vehicleData: VehicleDataService,
    private driverData: DriverDataService
  ) { }

  ngOnInit() {
    this.loadVehicles();

    //load drivers list
    this.driverData.getDriversData("").subscribe(result => {
      this.drivers = result;
    });
  }

  loadVehicles() {
    //Get vehicles
    this.vehicleData.getVehicles().subscribe(result => {
      this.vehicles = result;
    }, error => console.error(error));
  }

  selectVehicle(vehicle: Vehicle) {
    this.selectedVehicle = vehicle;
  }

  showVehicleDialog(v: Vehicle) {
    this.loadForm(v);
    this.vehicleModal.show();
  }

  loadForm(v: Vehicle) {
    if (v) {
      this.form.patchValue({
        vehicleId: v.id,
        vehicleName: v.description,
        capacity: v.capacity
      });
    }
    else {
      this.form.reset();
    }
  }

  loadModelFromForm(f): Vehicle {
    let v = new Vehicle();

    v.id = (f.vehicleId == null) ? 0 : f.vehicleId;
    v.description = f.vehicleName;
    v.capacity = f.capacity;

    return v;
  }

  submitVehicleData(f) {
    let v = this.loadModelFromForm(f); //Translate form values

    if (v.id != 0) { // Update
      this.vehicleData.updateVehicleData(v).subscribe(res => {
        // Reset and close form
        this.vehicleModal.hide();
        this.loadVehicles();
      });
    } else {
      // Insert
      this.vehicleData.addVehicleData(v).subscribe(res => {
        // Reset and close form
        this.vehicleModal.hide();
        this.loadVehicles();
      });
    }
  }

}
