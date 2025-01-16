import { CustomerAddress } from "./customer-address";

export class CustomerPickup {
    id: number;
    customerName: string;
    customerId: number;
    phoneNumber: string;
    pickupTime: Date;
    cancelled: Date;
    isCancelled: boolean;
    confirmed: Date;
    isConfirmed: boolean;
    dateAdded: Date;
    waitTime: number;
    routeId: number;
    routeName: string;
    notes:string;
    numberOfPassengers: number;
    price: number;
    addresses: CustomerAddress[];
}
