import { Component, OnInit } from '@angular/core';
import { CustomerAddress } from '../../models/customer-address';
import { Customer } from '../../models/customer';
import { Observable, Subject, of, Subscription, Observer } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, mergeMapTo, mergeMap, merge } from 'rxjs/operators';
import { CustomerDataService } from '../../services/customer-data.service';
import { CustomerPickup } from '../../models/customerpickup';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CustomerAddressComponent } from './customer-address/customer-address.component';
import { CustomerInfoComponent } from './customer-info/customer-info.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  public customers$: Observable<Customer[]>;
  private searchTerms = new Subject<string>();
  public customerAddress: CustomerAddress[];
  public customerPickups: CustomerPickup[];
  public currentCustomer: number;
  public currentPickup: number;
  public currentAddress = new CustomerAddress();

  //Map
  dir: any; // Directions
  latitude: number = 40.613953;
  longitude: number = -75.477791;
  public zoom = 10;
  originAddress: string;
  destAddress: string;

  //Modal
  bsModalRef: BsModalRef;

  constructor(
    private router: ActivatedRoute,
    private modalService: BsModalService,
    private customerData: CustomerDataService) {
  }

  ngOnInit() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    }

    //Route ID Parameter
    this.router.paramMap.subscribe(params => {
      this.currentCustomer = +params.get('id');
    });

    // //If ID is provided then fetch record
    let customerRec$;
    if (this.currentCustomer) {
      customerRec$ = new Observable<Customer[]>((observer: Observer<Customer[]>) => {
        this.customerData.getCustomerDatabyID(this.currentCustomer).subscribe(result => {
          observer.next(result);
          observer.complete();
        });
      });
    }

    this.customers$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.customerData.getCustomerData(term))
      //,mergeMapTo(customerRec$)
    );
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  getCustomerInfo(customerId: number) {
    this.currentCustomer = customerId;

    this.customerData.getCustumerAddressDataList(customerId).subscribe(result => {
      this.customerAddress = result;
    }, error => console.error(error));

    this.customerData.getCustomerPickups(customerId).subscribe(result => {
      this.customerPickups = result;
    }, error => console.error(error));
  }

  showLocation(add: CustomerAddress[], pickupId: number) {
    this.currentPickup = pickupId;


    //Go Through addresses
    for (let a of add) {
      if (a.sequence == 0) {
        this.originAddress = a.address1 + " " + a.city + " " + a.state + ", " + a.zipCode;
      }

      if (a.sequence == 100) {
        this.destAddress = a.address1 + " " + a.city + " " + a.state + ", " + a.zipCode;
      }
    }

    //Set map properties
    this.zoom = 10;
    this.dir = {
      origin: this.originAddress,
      destination: this.destAddress,
      mapOptions: {
        //suppressMarkers: true,
        markerOptions: {
          opacity: 0.7
        }
      }
    };
  }

  openCustInfoDialog(customer: Customer) {
    this.bsModalRef = this.modalService.show(CustomerInfoComponent, { class: "modal-lg" });
    this.bsModalRef.content.title = "Customer Info";
    if (customer){
      this.bsModalRef.content.customer = customer;
    }
  }

  openAddressDialog(custAddress: CustomerAddress): void {
    this.bsModalRef = this.modalService.show(CustomerAddressComponent, { class: "modal-lg" });
    this.bsModalRef.content.title = "Customer Address";
    if (custAddress){
      this.bsModalRef.content.customerAddress = custAddress;
    }
  }
}
