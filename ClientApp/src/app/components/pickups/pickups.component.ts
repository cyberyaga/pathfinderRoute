
import { Component, OnInit } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Customer } from '../../models/customer';
import { CustomerAddress } from '../../models/customer-address';
import { PickupDataService } from '../../services/pickup-data.service';
import { CustomerPickup } from '../../models/customerpickup';
import { PickupsOptionsComponent } from './pickups-options/pickups-options.component';
import { Route } from '../../models/route';
import { RouteDataService } from '../../services/route-data.service';

@Component({
  selector: 'app-pickups',
  templateUrl: './pickups.component.html',
  styleUrls: ['./pickups.component.css']
})

export class PickupsComponent implements OnInit {
  public latitude: number;
  public longitude: number;
  public zoom: number;
  dir = undefined; // Directions
  distance: string;
  duration: string;
  addressFrom: string;
  addressTo: string;

  //Selected Row
  selectedTable: string;
  selectedRow: number;


  //Datasets
  public pendingPickups: CustomerPickup[];
  public assignedPickups: CustomerPickup[];
  public pickedupPickups: CustomerPickup[];
  public cancelledPickups: CustomerPickup[];
  public completedPickups: CustomerPickup[];
  routes: Route[];

  constructor(
    //private dialog: MatDialog,
    private pickupData: PickupDataService,
    private routeData: RouteDataService
  ) { }

  ngOnInit() {
    this.zoom = 10;
    this.latitude = 40.613953;
    this.longitude = -75.477791;

    this.routeData.getRoutes(new Date()).subscribe(res => {
      this.routes = res;
    });

    //Get Pending
    this.pickupData.getPendingPickups().subscribe(res => {
      this.pendingPickups = res;
    });

    //Get Assigned
    this.pickupData.getAssignedPickups().subscribe(res => {
      this.assignedPickups = res;
    });

    //Get PickedUp
    this.pickupData.getPickedUpPickups().subscribe(res => {
      this.pickedupPickups = res;
    });

    //Get Cancelled
    this.pickupData.getCancelledPickups().subscribe(res => {
      this.cancelledPickups = res;
    });

    //Get Completed
    this.pickupData.getCompletedPickups().subscribe(res => {
      this.completedPickups = res;
    });


  }

  showDirections(adresses: CustomerAddress[], table: string, index: number) {
    this.latitude = 0;
    this.longitude = 0;
    this.dir = {
      origin: { lat: adresses[0].geoLat, lng: adresses[0].geoLong },
      destination: { lat: adresses[1].geoLat, lng: adresses[1].geoLong }
    };

    //Display Address
    this.addressFrom = adresses[0].address1 + ' ' + adresses[0].city + ' ' + adresses[0].state;
    this.addressTo = adresses[1].address1 + ' ' + adresses[1].city + ' ' + adresses[1].state;

    //Select Row
    this.selectedRow = index;
    this.selectedTable = table;
  }

  dirChange(directionsResult: any) {
    // Specify the distance and duration
    this.distance = directionsResult.routes[0].legs[0].distance.text;
    this.duration = directionsResult.routes[0].legs[0].duration.text;
  }

  openUInfoDialog(customerRec: Customer): void {
    // const dialogRef = this.dialog.open(PickupsOptionsComponent, {
    //   width: '600px',
    //   data: { custInfo: customerRec }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   //const tempcust = this.currentCustomer;
    //   // this.getCustomerData('');
    //   //this.currentCustomer = tempcust;
    // });
  }
}
