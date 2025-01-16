import { Component, OnInit, Inject } from '@angular/core';
import { Customer } from '../../../models/customer';
// import { FormGroup, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CustomerDataService } from '../../../services/customer-data.service';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit {
  customer = new Customer();

  //Modal
  title: string;
  closeBtnName: string;

  constructor(
    public bsModalRef: BsModalRef,
    private customerData: CustomerDataService) {

    // // If no data provided, then it's new
    // if (data.custInfo === undefined) {
    //   this.customer = new Customer(0, '', '', '', false);
    // } else {
    //   this.customer = data.custInfo;
    // }
  }

  ngOnInit() {
  }

  submitCustomerData() {
    if (this.customer.id !== 0) { // Update
      // console.log(this.customer);
      this.customerData.updateCustomerData(this.customer).subscribe(res => {
        // Reset and close form
        this.bsModalRef.hide();
      });
    } else {
      // Insert
      this.customerData.addCustomerData(this.customer).subscribe(res => {
        // Reset and close form
        this.bsModalRef.hide();
      });
    }
  }

}
