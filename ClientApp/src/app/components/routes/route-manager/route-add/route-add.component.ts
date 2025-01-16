import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MapsAPILoader, LatLngLiteral, LatLngBounds } from '@agm/core';
import { PricingBoundaryComponent } from '../../pricing-boundary/pricing-boundary.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '../../../../models/route';
import { RouteDataService } from '../../../../services/route-data.service';
import { debounceTime } from 'rxjs/operators';
import { Vehicle } from '../../../../models/vehicle';
import { boundary } from 'src/app/models/boundary';
import { routepricing } from 'src/app/models/routepricing';

@Component({
  selector: 'app-route-add',
  templateUrl: './route-add.component.html',
  styleUrls: ['./route-add.component.css']
})
export class RouteAddComponent implements OnInit {
  form = this.fb.group({
    id: [''],
    routeName: ['', Validators.required],
    routeDescription: [''],
    scheduledDeparture: ['', Validators.required],
    routeDayMon: [''],
    routeDayTue: [''],
    routeDayWed: [''],
    routeDayThu: [''],
    routeDayFri: [''],
    routeDaySat: [''],
    routeDaySun: [''],
    routeStarts: ['', Validators.required],
    routeExpires: [''],
    fromAddress: ['', Validators.required],
    fromGeoLat: [''],
    fromGeoLong: [''],
    fromBound: [''],
    toBound: [''],
    toAddress: ['', Validators.required],
    toGeoLat: [''],
    toGeoLong: [''],
    basePrice: [''],
    vehicleId: [{ value: '', disabled: true }],
    pricingBoundaryEnabled: [''],
    routePricings: this.fb.array([])
  });

  //==================Maps
  public latitude: number = 40;
  public longitude: number = -75;
  public blatitude: number = 40;
  public blongitude: number = -75;
  public zoom: number = 10;
  dir = undefined; // Directions
  //==================Maps

  boundaries = new Array<boundary>();
  assignedPriceRoute = new Array<routepricing>();

  //Subscription to URL ID
  private sub: Subscription;

  //Route Data
  currentRoute: number;
  route: Route;
  minDate: Date;

  //Modal
  selectedBoundary: boundary;
  selectPricingType: string;

  constructor(
    //private mapsAPILoader: MapsAPILoader,
    private routeData: RouteDataService,
    private router: Router,
    private aRouter: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    //Route ID Parameter
    this.sub = this.aRouter.paramMap.subscribe(params => {
      this.currentRoute = +params.get('id');
      if (this.currentRoute != 0) {
        this.routeData.getRoute(this.currentRoute).subscribe(result => {
          this.route = result;
          this.loadFormData();
        });
      }
      else { //if new set min date
        this.minDate = new Date();
      }
    });

    //Load Boundaries
    this.loadBoundaries();

    //Track Changes
    this.formChanged();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.blatitude = position.coords.latitude;
        this.blongitude = position.coords.longitude;
      });
    }
  }

  loadFormData() {
    //make sure the dates are real Date types
    this.route.routeStarts = this.route.routeStarts ? new Date(this.route.routeStarts) : this.route.routeStarts;
    this.route.routeExpires = this.route.routeExpires ? new Date(this.route.routeExpires) : this.route.routeExpires;
    this.minDate = this.route.routeStarts;

    this.form.patchValue(this.route);

    //Set pricing bounds
    this.route.routePricings.forEach(rp => {
      this.setPolyCoord(rp.boundary);
      this.addRoutePricing(rp);
    });

    //Show Destination
    this.destinationChaged();
  }

  loadBoundaries() {
    this.routeData.getBoundaries(0, true).subscribe(result => {
      let bounds = result;
      bounds.sort((a, b) => a.name.localeCompare(b.name));
      bounds.forEach(bound => {

        // //If not found, add
        // if (!this.routePriceBoundary.find(x => x.boundaryId == bound.id)) {
        this.setPolyCoord(bound);
        this.boundaries.push(bound);
        // }
      });
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

  boundaryClicked(selBoundary: boundary) {
    let center = this.getBounds(selBoundary.polyCoord).getCenter();
    this.blatitude = center.lat();
    this.blongitude = center.lng();
  }

  showModal(modal: any, bSet: string) {
    modal.show();
  }

  formChanged() {
    //TODO - This is triggering every second none stop
    // this.form.get('fromAddress').valueChanges.pipe(debounceTime(1000)).subscribe(val => {
    //   this.destinationChaged();
    // });

    // this.form.get('toAddress').valueChanges.pipe(debounceTime(1000)).subscribe(val => {
    //   this.destinationChaged();
    // });
  }

  destinationChaged() {
    let orig: any;
    let dest: any;

    if (this.pricingBoundaryEnabled) {
      //find routePricing
      let from = this.assignedPriceRoute.find(x => x.isFrom);
      let to = this.assignedPriceRoute.find(x => x.isTo);

      if (from && to) {
        orig = this.getBounds(from.boundary.polyCoord).getCenter();
        dest = this.getBounds(to.boundary.polyCoord).getCenter();
      }
    } else {
      orig = this.form.value.fromAddress ? this.form.value.fromAddress : '';
      dest = this.form.value.toAddress ? this.form.value.toAddress : '';
    }

    if (orig && dest) {
      this.dir = {
        origin: orig, destination: dest
      };
    } else {
      this.dir = undefined;
    }
    // console.log("dir changed");

  }

  submit(f) {
    let r = this.formToRoute(f);
    // console.log(r);
    if (!r.id || r.id === 0) {
      this.routeData.addRoute(r).subscribe(result => {
        this.router.navigate(['/routes/route-manager']);
      });
    } else {
      this.routeData.updateRoute(r).subscribe(result => {
        this.router.navigate(['/routes/route-manager']);
      });
    }

  }

  formToRoute(f): Route {
    let r = new Route();

    r.id = f.id ? f.id : 0;
    r.routeName = f.routeName;
    r.routeDescription = f.routeDescription;
    r.scheduledDeparture = f.scheduledDeparture; //strip time;
    r.fromAddress = f.fromAddress;
    r.toAddress = f.toAddress;
    r.routeDayMon = f.routeDayMon ? f.routeDayMon : false;
    r.routeDayTue = f.routeDayTue ? f.routeDayTue : false;
    r.routeDayWed = f.routeDayWed ? f.routeDayWed : false;
    r.routeDayThu = f.routeDayThu ? f.routeDayThu : false;
    r.routeDayFri = f.routeDayFri ? f.routeDayFri : false;
    r.routeDaySat = f.routeDaySat ? f.routeDaySat : false;
    r.routeDaySun = f.routeDaySun ? f.routeDaySun : false;
    r.routeStarts = f.routeStarts;
    r.routeExpires = f.routeExpires;
    r.basePrice = +f.basePrice;
    r.vehicleId = f.vehicleId;
    r.pricingBoundaryEnabled = f.pricingBoundaryEnabled;

    //Route Pricing
    let rp = new Array<routepricing>();
    this.routePricings.controls.forEach(c => {
      let p = new routepricing();
      p.additionalCost = c.get('additionalCost').value;
      p.boundaryId = c.get('boundaryId').value;
      p.isFrom = c.get('isFrom').value;
      p.isTo = c.get('isTo').value;
      //p.routeId = c.get('routeId').value;
      rp.push(p);
    });
    r.routePricings = rp;

    if (r.routeStarts) {
      r.routeStarts.setHours(0, 0, 0, 0); //strip time
    }

    if (r.routeExpires) {
      r.routeExpires.setHours(0, 0, 0, 0); //strip time
    }
    return r;
  }

  get routePricings() {
    return this.form.get('routePricings') as FormArray;
  }

  get pricingBoundaryEnabled() {
    let enabled = this.form.get('pricingBoundaryEnabled').value as boolean;
    if (enabled) {
      this.routePricings.enable();
      this.form.get('fromAddress').disable();
      this.form.get('toAddress').disable();
    } else {
      this.routePricings.disable();
      this.form.get('fromAddress').enable();
      this.form.get('toAddress').enable();
    }
    return enabled;
  }

  addRoutePricing(rPrice: routepricing) {
    let rp = new routepricing();

    if (rPrice) {
      rp = rPrice;
    }
    else if (this.selectedBoundary) {
      rp.additionalCost = 0;
      rp.isFrom = this.selectPricingType == "From";
      rp.isTo = this.selectPricingType == "To";
      rp.boundaryId = this.selectedBoundary[0].id;
      rp.boundaryName = this.selectedBoundary[0].name;
      rp.boundary = this.selectedBoundary[0];
    }

    //create rp
    let rpf = this.fb.group({
      id: [rp.id],
      additionalCost: [rp.additionalCost],
      isFrom: [rp.isFrom],
      isTo: [rp.isTo],
      boundaryId: [rp.boundaryId],
      boundaryName: [rp.boundaryName]
    });

    this.routePricings.push(rpf);
    this.assignedPriceRoute.push(rp);
    this.selectedBoundary = undefined;
    this.selectPricingType = undefined;
    this.destinationChaged();
  }

  removeRoutePricing(i: number, boundaryId: number) {
    let bindex = this.assignedPriceRoute.findIndex(x => x.boundaryId == boundaryId);
    if (bindex != -1) {
      this.assignedPriceRoute.splice(bindex, 1);
    }

    this.routePricings.removeAt(i);
    this.destinationChaged();
  }
}
