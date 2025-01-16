import { Component, OnInit } from '@angular/core';
import { Route } from '../../../models/route';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { RouteDataService } from '../../../services/route-data.service';
import { Vehicle } from 'src/app/models/vehicle';
import { driver } from 'src/app/models/driver';
import { VehicleDataService } from 'src/app/services/vehicle-data.service';
import { DriverDataService } from 'src/app/services/driver-data.service';
import { routeday } from 'src/app/models/routeday';

@Component({
  selector: 'app-route-manager',
  templateUrl: './route-manager.component.html',
  styleUrls: ['./route-manager.component.css']
})
export class RouteManagerComponent implements OnInit {
  routes: Route[];
  vehicles: Vehicle[];
  drivers: driver[];
  selectedDate: Date;
  bsConfig: Partial<BsDatepickerConfig>;


  constructor(
    private router: Router,
    private routeData: RouteDataService,
    private vehicleData: VehicleDataService,
    private driverData: DriverDataService
  ) {
    this.bsConfig = Object.assign({}, { showWeekNumbers: false });

  }

  ngOnInit() {
    this.selectedDate = new Date();

    this.vehicleData.getVehicles().subscribe(res => {
      this.vehicles = res;
    });

    this.driverData.getDriversData("").subscribe(res => {
      this.drivers = res;
    });

    this.routeData.getRoutes(new Date(), true).subscribe(res => {
      this.routes = res;
    });
  }

  routeDateChange(event: Date) {
    event.setHours(0, 0, 0, 0); //strip time
    this.selectedDate = event;
    this.routeData.getRoutes(event, true).subscribe(res => {
      this.routes = res;
    });
  }

  routeClick(route: number) {
    this.router.navigate(['/routes/route-manager/route-add/' + route]);
  }

  routeChange(route: Route) {
    let rd = new routeday;

    rd.id = route.routeDayId;
    rd.routeId = route.id;
    rd.routeDate = this.selectedDate;
    rd.driverId = route.driverId;
    rd.vehicleId = route.vehicleId;
    rd.isCancelled = route.isCancelled;

    this.routeData.updateRouteDay(rd).subscribe(result => {
      //console.log("Record Updated.");
    })
  }

}
