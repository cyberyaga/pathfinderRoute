
import { Component, OnInit, ViewChild, ElementRef, NgZone } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PickupDataService } from "../../../services/pickup-data.service";
import { CustomerDataService } from '../../../services/customer-data.service';
import { MapsAPILoader } from "@agm/core";
import { Pickup } from "../../../models/pickup";
import { CustomerAddress } from "../../../models/customer-address";
import { Customer } from "../../../models/customer";
import { Observable, of } from "rxjs";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead";
import { Router, ActivatedRoute } from "@angular/router";
import { Route } from "../../../models/route";
import { DatePipe } from "@angular/common";
import { routepricing } from "src/app/models/routepricing";
import { mergeMap } from "rxjs/operators";


@Component({
  selector: 'app-pickups-add',
  templateUrl: './pickups-add.component.html',
  styleUrls: ['./pickups-add.component.css']
})
export class PickupsAddComponent implements OnInit {
  form = new FormGroup({
    searchCustname: new FormControl(),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl(),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(10)
    ]),
    smsEnabled: new FormControl(),
    pickUp: new FormControl('', Validators.required),
    dropOff: new FormControl('', Validators.required),
    passengers: new FormControl(1, Validators.required),
    notes: new FormControl(),
    pickUpDate: new FormControl({
      value: '', disabled: true
    }),
    pickUpTime: new FormControl({
      value: '', disabled: true
    }),
    pickUpASAP: new FormControl(true),
    route: new FormControl(),
    routeDate: new FormControl({
      showWeekNumbers: false,
      minDate: new Date()
    }),
    pickupPrice: new FormControl()
  });

  formMode: string;

  //Model
  model = new Pickup();
  //Route Data
  routes: Route[];
  currentRoute: Route;
  additionalPrice = []

  //==================Maps
  map: any;
  latitude: number = 40.613953;
  longitude: number = -75.477791;
  zoom: number = 10;
  fromPlace: google.maps.places.PlaceResult;
  toPlace: google.maps.places.PlaceResult;
  dir = undefined; // Directions
  distance: string;
  duration: string;
  showMarker: boolean = false;
  assignedPriceRoute: Array<routepricing>;

  @ViewChild("pickupsearch")
  searchfromElementRef: ElementRef;
  @ViewChild("dropoffsearch")
  searchtoElementRef: ElementRef;
  fromOutofBound = false;
  fromNotFrom = false;
  fromValid = false;
  toOutofBound = false;
  toNotTo = false;
  toValid = false;
  //==================Maps

  // Customer Typeahead Lookup
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  // customers$: Observable<Customer[]>;
  customers$: Observable<any>;

  //DatePick min value
  minDateVal = new Date();

  constructor(
    private pickupData: PickupDataService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private customerData: CustomerDataService,
    private router: Router,
    private aRouter: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    }

    this.aRouter.queryParams.subscribe(params => {
      this.formMode = params['formMode'];
      if (params['routeId']) {
        this.model.routeId = +params['routeId'];
      }
      if (params['routeDate']) {
        this.model.routeDate = new Date(params['routeDate']);
      }
    });

    //Model
    this.model.PickupTime = new Date();

    //Wire Up Address Search
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const fromautocomplete = new google.maps.places.Autocomplete(this.searchfromElementRef.nativeElement);
      fromautocomplete.addListener('place_changed', () => this.placeChange(fromautocomplete.getPlace(), 'from'));

      const toautocomplete = new google.maps.places.Autocomplete(this.searchtoElementRef.nativeElement);
      toautocomplete.addListener('place_changed', () => this.placeChange(toautocomplete.getPlace(), 'to'));
    });

    //Wire up TypeAhead
    // TypeAhead Customer Search
    this.customers$ = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.searchCustname.value as string);
    }).pipe(
      mergeMap((token: string) => this.customerData.getCustomerData(token))
    );
  }

  mapReady(map) {
    map.fullscreenControl = true;
    map.streetViewControl = false;

    let trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
    this.map = map;
  }

  submit(f) {
    if (!this.model.customer || 
      (this.model.customer && (this.model.customer.firstName != f.firstName ||
      this.model.customer.lastName != f.lastName ||
      this.model.customer.phoneNumber != f.phoneNumber ||
      this.model.customer.smsEnabled != f.smsEnabled))) {

      this.model.customer = new Customer();
      this.model.customer.id = 0;
      this.model.customer.firstName = f.firstName;
      this.model.customer.lastName = f.lastName;
      this.model.customer.phoneNumber = f.phoneNumber;
      this.model.customer.smsEnabled = f.smsEnabled;
    }

    this.model.NumberOfPassengers = f.passengers;
    this.model.PickupASAP = f.pickUpASAP;
    this.model.notes = f.notes;
    this.model.price = f.pickupPrice;
    //this.model.calculatedPrice = f.price;

    //If Checked, don't submit
    if (!this.form.get('pickUpASAP').value) {
      let pickupstr: string = this.form.get('pickUpDate').value + ' ' + this.form.get('pickUpTime').value;
      this.model.PickupTime = new Date(pickupstr);
    }

    //Set pickup time as the route date
    if (this.formMode == "Route") {
      this.model.PickupTime = this.model.routeDate;
    }

    //Address
    let from = this.setAddress(this.fromPlace, 0);
    let to = this.setAddress(this.toPlace, 100);
    this.model.PickupAddresses = [from, to];

    this.pickupData.addCustomerPickupData(this.model).subscribe(res => {
      switch (this.formMode) {
        case "Route":
          this.router.navigate(['/routes/route-view/' + this.model.routeId], { queryParams: { routeDate: this.datePipe.transform(this.model.routeDate, "yyyy-MM-dd") } });
          break;
        case "Pickup":
          this.router.navigate(['/pickups']);
          break;
      }
    });
  }

  //When the pickup ASAP checkbox it toggled
  toggleAsap(element: HTMLInputElement) {
    if (element.checked) {
      this.form.get('pickUpDate').disable();
      this.form.get('pickUpTime').disable();
    } else {
      this.form.get('pickUpDate').enable();
      this.form.get('pickUpTime').enable();
      //this.model.PickupTime = new Date();
    }
  }

  createPlaceFromAddress(address: string, place_id: string, type: string) {
    let pService = new google.maps.places.PlacesService(this.map);



    if (place_id != null) {
      let request = {
        placeId: place_id,
        fields: ['address_component', 'formatted_address', 'geometry']
      };
      pService.getDetails(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.placeChange(results, 'from');
        }
      });
    }
    else {
      let request = {
        query: address,
        fields: ['place_id', 'formatted_address', 'geometry'],
      };
      pService.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          let pidRequest = {
            placeId: results[0].place_id,
            fields: ['address_component', 'formatted_address', 'geometry']
          };

          pService.getDetails(pidRequest, (pidResults, status) => {
            this.placeChange(pidResults, 'from');
          });
        }
      });
    }



  }

  placeChange(place: google.maps.places.PlaceResult, type: string) {
    // console.log("triggered");
    this.ngZone.run(() => {
      // verify result
      if (place.geometry === undefined || place.geometry === null) {
        return;
      }

      if (type === 'from') {
        this.showMarker = true;
        this.fromPlace = place;
        this.form.get('pickUp').setValue(place.formatted_address);
      }
      if (type === 'to') {
        this.showMarker = true;
        this.toPlace = place;
      }

      // if both are set, draw directions
      if (this.fromPlace && this.toPlace) {
        this.dir = {
          origin: { lat: this.fromPlace.geometry.location.lat(), lng: this.fromPlace.geometry.location.lng() },
          destination: { lat: this.toPlace.geometry.location.lat(), lng: this.toPlace.geometry.location.lng() }
        };
      }

      //Check location
      if (this.currentRoute.pricingBoundaryEnabled && this.currentRoute.routePricings) {
        let anyOutbound = true;
        let anyNotaNot = false;

        //see if inbound
        this.currentRoute.routePricings.forEach(rp => {
          let inBound = google.maps.geometry.poly.containsLocation(place.geometry.location, rp.boundary.polyCoord);

          if (inBound) {
            this.calculateCost({ boundaryName: rp.boundaryName, additionalCost: rp.additionalCost, type: type });
            anyOutbound = false;

            //check direction
            let thisType = '';
            if (rp.isFrom) {
              thisType = 'from';
            }
            if (rp.isTo) {
              thisType = 'to';
            }
            if (thisType != type) {
              anyNotaNot = true;
            }
          }
        });

        //If any inbound
        if (type == 'from') {
          this.fromOutofBound = anyOutbound;
          this.fromNotFrom = anyNotaNot;
        }
        if (type == 'to') {
          this.toOutofBound = anyOutbound;
          this.toNotTo = anyNotaNot;
        }

        this.fromValid = !this.fromOutofBound && !this.fromNotFrom;
        this.toValid = !this.toOutofBound && !this.toNotTo;
      }

      // set latitude, longitude and zoom
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
      this.zoom = 15;
      return place;
    });
  }

  setAddress(gmapAdd: google.maps.places.PlaceResult, sequence: number): CustomerAddress {
    let c = new CustomerAddress();
    let snumber: string;
    let sname: string;

    if (gmapAdd) {
      gmapAdd.address_components.forEach(e => {
        switch (e.types[0]) {
          case "street_number":
            snumber = e.short_name;
            break;
          case "route":
            sname = e.long_name;
            break;
          case "locality":
          case "sublocality_level_1":
            c.city = e.short_name;
            break;
          case "administrative_area_level_1":
            c.state = e.short_name;
            break;
          case "postal_code":
            c.zipCode = e.short_name;
            break;
        }
      });

      //GeoLocation
      c.geoLat = gmapAdd.geometry.location.lat();
      c.geoLong = gmapAdd.geometry.location.lng();

      //Set Address
      c.address1 = snumber + " " + sname;
      c.sequence = sequence;
    }

    //return
    return c;
  }

  dirChange(directionsResult: any) {
    // Specify the distance and duration
    this.distance = directionsResult.routes[0].legs[0].distance.text;
    this.duration = directionsResult.routes[0].legs[0].duration.text;
  }

  // Typeahead =============
  get searchCustname() {
    return this.form.get('searchCustname');
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    this.model.customer = e.item as Customer;

    this.form.get('firstName').setValue(this.model.customer.firstName);
    this.form.get('lastName').setValue(this.model.customer.lastName);
    this.form.get('phoneNumber').setValue(this.model.customer.phoneNumber);
    this.form.get('smsEnabled').setValue(this.model.customer.smsEnabled);

    if (this.model.customer.customerAddress.length > 0) {
      let a = this.model.customer.customerAddress[0];
      //Set Address
      this.createPlaceFromAddress(a.address1 + " " + a.city + " " + a.state + ", " + a.zipCode, null, "from");
      this.latitude = a.geoLat;
      this.longitude = a.geoLong;
      this.zoom = 15;

    }
  }

  routeChange(event) {
    this.model.routeId = event.currentRoute;
    this.model.routeDate = event.selectedDate;
    this.assignedPriceRoute = event.currentRouteObj.routePricings;
    this.currentRoute = event.currentRouteObj;
    this.calculateCost(undefined);
  }

  calculateCost(newBound) {
    if (newBound) {
      //Delete if present
      let delIndex = this.additionalPrice.findIndex(f => f.type == newBound.type);
      if (delIndex !== -1) {
        this.additionalPrice.splice(delIndex, 1);
      }
      this.additionalPrice.push(newBound);
    }

    //Sort
    this.additionalPrice.sort((a, b) => a.type.localeCompare(b.type));

    //Calculate Price
    let base = this.currentRoute ? this.currentRoute.basePrice : 0;
    let addCost = 0;
    let pass = +this.form.get('passengers').value;
    this.additionalPrice.forEach(c => { addCost += c.additionalCost });
    this.form.get('pickupPrice').setValue((base + addCost) * pass);
  }


}
