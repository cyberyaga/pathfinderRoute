//import { Pickup } from "./pickup";
import { CustomerPickup } from "./customerpickup";
import { routepricing } from "./routepricing";

export class Route {
    public id: number;
    public routeName: string;
    public routeDescription: string;
    public scheduledDeparture: string;
    public routeStarts: Date;
    public routeExpires: Date;
    public basePrice: number;
    public fromAddress: string;
    public fromGeoLat: number;
    public fromGeoLong: number;
    public toAddress: string;
    public toGeoLat: number;
    public toGeoLong: number;
    public routeDayMon: boolean;
    public routeDayTue: boolean;
    public routeDayWed: boolean;
    public routeDayThu: boolean;
    public routeDayFri: boolean;
    public routeDaySat: boolean;
    public routeDaySun: boolean;
    public pricingBoundaryEnabled: boolean;
    public routePricings: Array<routepricing>;

    //Additional Fields
    public pickupCount: number;
    public passengerCount: number;
    public pickups: CustomerPickup[];
    public vehicleId: number;
    public assignedVehicle: string;
    public vehicleCapacity: number;
    public driverId: number;
    public driverName: string;
    public isCancelled: boolean;
    public routeDayId: number;
}