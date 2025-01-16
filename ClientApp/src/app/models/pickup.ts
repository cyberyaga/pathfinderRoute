import { Customer } from './customer';
import { CustomerAddress } from './customer-address';

export class Pickup {
    public id: number;
    public customer: Customer;
    public PickupTime: Date;
    public routeId: number;
    public routeDate: Date;
    public Cancelled: Date;
    public PickupASAP: boolean;
    public NumberOfPassengers: number;
    public notes: string;
    public price: number;
    public calculatedPrice: number;
    public PickupAddresses: CustomerAddress[];
    constructor(){
        this.routeDate = new Date();
        this.customer = new Customer();
        this.PickupAddresses = new Array<CustomerAddress>();
    }

}
