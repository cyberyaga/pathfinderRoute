import { Component, NgZone, ViewChild, ElementRef, Input, forwardRef, Output, EventEmitter, Injector, AfterViewInit } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, FormControl } from '@angular/forms';
import { CustomerAddress } from 'src/app/models/customer-address';
import { routepricing } from 'src/app/models/routepricing';

const noop = () => {
};

@Component({
  selector: 'app-addresautocomplete',
  templateUrl: './addresautocomplete.component.html',
  styleUrls: ['./addresautocomplete.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddresautocompleteComponent),
      multi: true
    }
  ]
})
export class AddresautocompleteComponent implements ControlValueAccessor, AfterViewInit {

  @ViewChild("addresssearch")
  searchElementRef: ElementRef;
  autocomplete: google.maps.places.Autocomplete;

  latitude: number = 40;
  longitude: number = -75;
  map: any;

  @Input('value') val: string = '';
  @Input() placeId: string;
  @Input() prepend: string;
  @Input() append: string;
  @Input() pricingBounds: Array<routepricing>;
  @Input() errorMsg: string = 'A value is required.';
  @Input() directionType: string = '';
  outOfBound = false;
  @Input() outOfBoundMsg: string = '';
  wrongDirection = false;
  @Input() wrongDirectionMsg: string = '';
  onChange: any = () => { };
  onTouched: any = () => { };

  //Placeholders for the callbacks which are later providesd
  //by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;


  @Input() placeholder = "Search for address";
  //define the event emitter
  @Output() addressChange = new EventEmitter<any>();

  control: FormControl = new FormControl();

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _injector: Injector) { }

  ngOnInit() {

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    }

    //Wire Up Address Search
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      this.autocomplete.addListener('place_changed', () => this.placeChange(this.autocomplete.getPlace()));
    });
  }

  ngAfterViewInit() {
    //Assign instance of the control
    this.control = this._injector.get(NgControl).control as FormControl;
  }

  mapReady(mapInstance) {
    this.map = mapInstance;
    if (this.placeId && this.placeId !== "") {
      this.createPlaceFromAddress(null, this.placeId);
    } else if (this.val && this.val != null) {
      this.createPlaceFromAddress(this.val, null);
    }
  }

  get value() {
    return this.val;
  }

  set value(val) {
    this.val = val;
    this.onChange(val);
    this.onTouched();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  //Set touched on blur
  onBlur() {
    this.onTouched();
  }

  writeValue(value) {
    if (value) {
      this.value = value;
    }
  }

  placeChange(place: google.maps.places.PlaceResult) {
    this.ngZone.run(() => {
      if (place.geometry) {

        // console.log('outOfBound');
        this.control.setErrors({ 'outOfBound': true });


        //Check location
        if (this.pricingBounds) {
          let anyInbound = false;
          let anyNotaNot = false;

          //see if inbound
          this.pricingBounds.forEach(rp => {
            let inBound = google.maps.geometry.poly.containsLocation(place.geometry.location, rp.boundary.polyCoord);

            if (inBound) {
              anyInbound = true;

              //check direction
              let thisType = '';
              if (rp.isFrom) {
                thisType = 'from';
              }
              if (rp.isTo) {
                thisType = 'to';
              }
              if (thisType != this.directionType) {
                anyNotaNot = true;
              }
            }
          });

          if (!anyInbound) {
            // console.log('outOfBound');
            this.control.setErrors({ 'outOfBound': true });
          }

          if (anyNotaNot) {
            this.control.setErrors({ 'wrongDirection': true });
          }
        }

        let custAddress = this.setAddress(place, 0);
        if (custAddress) {
          this.writeValue(custAddress.address1 + " " + custAddress.city + " " + custAddress.state + ", " + custAddress.zipCode);
          this.addressChange.emit({ customerAddress: custAddress, placeObj: place });
        }
      }
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

  createPlaceFromAddress(address: string, place_id: string) {
    this.ngZone.run(() => {
      let pService = new google.maps.places.PlacesService(this.map);

      if (place_id != null) {
        let request = {
          placeId: place_id,
          fields: ['address_component', 'formatted_address', 'geometry']
        };
        pService.getDetails(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.placeChange(results);
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
              this.placeChange(pidResults);
            });
          }
        });
      }
    });
  }
}
