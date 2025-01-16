export class CustomerAddress {
    public id?: number;
    public customerId?: number;
    public sequence?: number;
    public address1?: string;
    public address2?: string;
    public city?: string;
    public state?: string;
    public zipCode?: string;
    public geoLat?: number;
    public geoLong?: number;
    public added?: Date;
    public addedBy?: string;
    public modified?: Date;
    public modifiedBy?: string;

    constructor() { }
}
