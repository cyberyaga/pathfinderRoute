import { driver } from "./driver";

export class Vehicle {
  public id: number;
  public description: string;
  public capacity: number;
  public assignedRouteId: number;
  public driver: driver;
}
