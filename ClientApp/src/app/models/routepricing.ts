import { boundary } from "./boundary";

export class routepricing {
    public id: number;
    public additionalCost: number;
    public isFrom: boolean;
    public isTo: boolean;
    public routeId: number;
    public boundaryId: number;
    public boundaryName: string;
    public boundary: boundary;

    public routepricing(){
        this.id = 0;
        this.additionalCost = 0;
        this.isFrom = false;
        this.isTo = false;
        this.boundaryId = 0;
        this.boundary = new boundary();
    }
}