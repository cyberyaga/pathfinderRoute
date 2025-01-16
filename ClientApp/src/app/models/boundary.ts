import { LatLngLiteral } from "@agm/core";

export class boundary{
    public id: number;
    public name: string;
    public color: string;
    public coordinates: Array<boundaryCoord>;
    public polyCoord: google.maps.Polygon;
    public plainCoord: Array<LatLngLiteral>;
    public cost: number;

    public boundary(){
        this.id = 0;
        this.name = '';
        this.color = '#000000';
        this.coordinates = new Array<boundaryCoord>();
        this.polyCoord = new google.maps.Polygon();
        this.plainCoord = new Array<LatLngLiteral>();
        this.cost = 0;
    }
}

export class boundaryCoord {
    public geoLat: number;
    public geoLong: number;
    public coordinateOrder: number;
}