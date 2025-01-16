
import { Component, OnInit, TemplateRef } from '@angular/core';
import { MapsAPILoader, LatLngLiteral } from '@agm/core';
import { RouteDataService } from '../../../services/route-data.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomerAddress } from '../../../models/customer-address';
import { Pickup } from '../../../models/pickup';
import { PickupDataService } from '../../../services/pickup-data.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CustomerPickup } from '../../../models/customerpickup';
import { routepricing } from 'src/app/models/routepricing';
import { boundary } from 'src/app/models/boundary';

@Component({
  selector: 'app-route-view',
  templateUrl: './route-view.component.html',
  styleUrls: ['./route-view.component.css']
})
export class RouteViewComponent implements OnInit {
  private sub: Subscription;
  selectedDate: Date = new Date();

  //Map
  public latitude: number;
  public longitude: number;
  public zoom: number;
  map: any;
  trafficLayer;
  showTrafficLayer = true;
  dir: any;
  ways = [];

  //Route Data
  currentRoute: number;
  currentRouteCancelled: boolean;
  fromAddress: string = "";
  toAddress: string = "";
  pickups: CustomerPickup[];
  cancelledPicks = [];
  selectedPickupId: number; //Represents the pickup that's been selected.
  selectedCustomerPickup: CustomerPickup;
  assignedPriceRoute = new Array<routepricing>();

  //Form Properties
  addDisabled: boolean = false;
  modalRef: BsModalRef;
  allowMove: boolean;


  constructor(
    private routeData: RouteDataService,
    private pickupData: PickupDataService,
    private router: ActivatedRoute,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.setMap();
    //Route ID Parameter
    this.sub = this.router.paramMap.subscribe(params => {
      this.currentRoute = +params.get('id');
    });

    //Optional Query Params
    this.router.queryParams.subscribe(params => {
      if (params['routeDate']) {
        this.selectedDate = new Date(params['routeDate'] + "T00:00:00");
      }
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    }
  }

  mapReady(map) {
    map.fullscreenControl = true;
    map.streetViewControl = false;
    this.map = map;
    this.trafficLayer = new google.maps.TrafficLayer();
    this.toggleTraffic();
  }

  toggleTraffic(){
    if (this.showTrafficLayer){
      this.trafficLayer.setMap(this.map);
    }
    else {
      this.trafficLayer.setMap(null);
    }
  }

  routeChange(event) {
    //Prevent false add
    if (event.selectedDate) {
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      this.addDisabled = event.selectedDate < today;
    }

    this.currentRoute = event.currentRoute;
    this.selectedDate = event.selectedDate;

    //Load route info
    this.loadRouteData(this.currentRoute);
    this.loadPickupData();
  }

  loadRouteData(routeId: number) {
    this.routeData.getRoute(routeId).subscribe(r => {
      this.currentRouteCancelled = r.isCancelled;

      //Assign Poly and dir
      if (r.routePricings) {
        r.routePricings.forEach(rp => {
          this.setPolyCoord(rp.boundary);
        });
        this.assignedPriceRoute = r.routePricings;
        //find routePricing
        let from = this.assignedPriceRoute.find(x => x.isFrom);
        let to = this.assignedPriceRoute.find(x => x.isTo);

        if (from && to) {
          this.dir.origin = this.getBounds(from.boundary.polyCoord).getCenter();
          this.dir.destination = this.getBounds(to.boundary.polyCoord).getCenter();
        }
      } else {
        this.dir.origin = r.fromAddress;
        this.dir.destination = r.toAddress;
      }
    });
  }

  loadPickupData() {
    this.ways = [];
    this.cancelledPicks = [];
    //Get Route and map it
    this.routeData.getRoutePickups(this.currentRoute, this.selectedDate).subscribe(result => {
      this.pickups = result;
      for (let p of this.pickups) { //For each pickup
        for (let a of p.addresses) {//.filter(x => x.sequence == 0)) { //Get starting locations only
          if (p.isCancelled) {
            this.cancelledPicks.push({ lat: a.geoLat, lng: a.geoLong, opacity: 0.7 });
          }
          else {
            this.ways.push({ location: { lat: a.geoLat, lng: a.geoLong } });
          }
        }
      }

      //Set map properties
      this.dir.waypoints = this.ways;
    });
  }

  showLocation(addrs: CustomerAddress[], p: CustomerPickup) {
    //Selected Customer
    this.selectedCustomerPickup = p;

    if (addrs) {
      let start: CustomerAddress = addrs.find(x => x.sequence == 0);
      if (start) { //If address found, show marker.

        //Set the location of pickup
        this.latitude = start.geoLat;
        this.longitude = start.geoLong;
        this.zoom = 17;
      }
    }
  }

  setMap() {
    let o = "";
    let d = "";
    if (this.dir) {
      o = this.dir.origin;
      d = this.dir.destination;
    }


    this.dir = []; //Clean values
    this.dir = {
      origin: o,
      destination: d,
      waypoints: this.ways,
      optimizeWaypoints: true,
      mapOptions: {
        //suppressMarkers: true,
        markerOptions: {
          opacity: 0.7
        }
      }
    };

    this.zoom = 10;
    this.dir.origin = o;
    this.dir.destination = d;
  }

  openModal(template: TemplateRef<any>, pId: number) {

    this.selectedPickupId = pId;
    this.modalRef = this.modalService.show(template);
  }

  confirmPickup(p: Pickup) {
    this.pickupData.confirmCustomerPickup(p.id).subscribe(result => {
      this.loadPickupData();
    });
  }

  confirmCancel() {
    this.pickupData.cancelCustomerPickup(this.selectedPickupId).subscribe(result => {
      this.modalRef.hide(); //Close modal
      this.loadPickupData();
    });
  }

  //Move Data
  selectedMoveRoute: number;
  selectedMoveDate: Date;
  routeMoveChange(event) {
    this.selectedMoveRoute = event.currentRoute;
    this.selectedMoveDate = event.selectedDate;
  }

  movePickup(modalRef) {
    this.pickupData.moveCustomerPickupData(this.selectedPickupId, this.selectedMoveRoute, this.selectedMoveDate).subscribe(result => {
      this.currentRoute = this.selectedMoveRoute;
      this.selectedDate = this.selectedMoveDate;
      this.loadPickupData();
      modalRef.hide();
    });
  }


  setPolyCoord(bound: boundary) {
    //Loop through each boundary
    let poly = new Array<LatLngLiteral>();

    //sort
    bound.coordinates.sort((a, b) => a.coordinateOrder - b.coordinateOrder);

    //Convert to google lat/lng
    bound.coordinates.forEach(e => {
      poly.push({ lat: e.geoLat, lng: e.geoLong });
    });

    //Construct Google Poly
    let newpoly = new google.maps.Polygon({
      paths: poly,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: bound.color,
      fillOpacity: 0.35
    });

    //Set it in the property
    bound.polyCoord = newpoly;
    bound.plainCoord = poly;
  }

  getBounds(poly: google.maps.Polygon): google.maps.LatLngBounds {
    let bounds = new google.maps.LatLngBounds();
    if (poly) {
      let paths = poly.getPaths();
      let path: any;
      for (let i = 0; i < paths.getLength(); i++) {
        path = paths.getAt(i);
        for (let ii = 0; ii < path.getLength(); ii++) {
          bounds.extend(path.getAt(ii));
        }
      }
    }
    return bounds;
  }
}
