
import { Component, OnInit, Inject, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CustomerAddress } from '../../../models/customer-address';
import { FormControl } from '@angular/forms';
import { CustomerDataService } from '../../../services/customer-data.service';
import { MapsAPILoader } from '@agm/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.css']
})
export class CustomerAddressComponent implements OnInit {
  baseUrl: string;
  CustomerID: number;
  customerAddress = new CustomerAddress();

  //==================Maps
  public latitude: number;
  public longitude: number;
  public zoom: number;
  enableMarker = false;
  
  //Address Search
  @ViewChild("addressSearch")
  public addressSearch: ElementRef;

  //Modal
  title: string;


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public bsModalRef: BsModalRef,
    private customerData: CustomerDataService) {
  }

  ngOnInit() {
    if (this.customerAddress.id > 0) {
      this.latitude = this.customerAddress.geoLat;
      this.longitude = this.customerAddress.geoLong;
      this.zoom = 15;
    } else {
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 10;
        });
      }
    }

    // Wire Up Address Search load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      const fromautocomplete = new google.maps.places.Autocomplete(this.addressSearch.nativeElement);
      fromautocomplete.addListener('place_changed', () => this.placeChange(fromautocomplete));
    });
  }

  placeChange(autocomplete: google.maps.places.Autocomplete) {
    this.ngZone.run(() => {
      // get the place result
      const place: google.maps.places.PlaceResult = autocomplete.getPlace();

      // verify result
      if (place.geometry === undefined || place.geometry === null) {
        return;
      }

      // set latitude, longitude and zoom
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
      this.zoom = 15;

      let tmpId = this.customerAddress.id;
      let tmpCId = this.customerAddress.customerId;
      this.customerAddress = this.setAddress(place, 0);
      this.customerAddress.id = tmpId;
      this.customerAddress.customerId = tmpCId;
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
      this.enableMarker = true;

      //Set Address
      c.address1 = snumber + " " + sname;
      c.sequence = sequence;
    }

    //return
    return c;
  }

  setCustomerAddressData() {
    // If New
    if (this.customerAddress.id === 0) {
      this.customerAddress.customerId = this.CustomerID;
      this.customerData.addCustomerAddressData(this.customerAddress).subscribe(res => {
        // Reset and close form
        this.bsModalRef.hide();
      });
    } else { // If Update
      this.customerData.updateCustomerAddressData(this.customerAddress).subscribe(res => {
        // Reset and close form
        this.bsModalRef.hide();
      });
    }
  }

  submitAddress() {
    // Call Update/Add
    this.setCustomerAddressData();
  }
}
