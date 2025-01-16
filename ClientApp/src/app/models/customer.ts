import { CustomerAddress } from './customer-address';

export class Customer {
    private _fullName: string;
   
    constructor(
        public id?: number,
        public firstName?: string,
        public lastName?: string,
        public phoneNumber?: string,
        public smsEnabled?: boolean,
        public customerAddress?: CustomerAddress[]
    ) {}

    get fullName(){
        return this.firstName + ' ' + this.lastName;
    }
}
