import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Route } from '../../../models/route';
import { RouteDataService } from '../../../services/route-data.service';
import { IMyMarkedDates, INgxMyDpOptions, IMyDateModel, IMyDate } from 'ngx-mydatepicker';
import { DatePipe } from '@angular/common';
import { boundary } from 'src/app/models/boundary';
import { LatLngLiteral } from '@agm/core';

@Component({
  selector: 'app-route-picker',
  templateUrl: './route-picker.component.html',
  styleUrls: ['./route-picker.component.css']
})
export class RoutePickerComponent implements OnInit {
  @Input() selectedRoute: number = 0;
  @Input() selectedDate: Date = new Date();
  @Input() minimumDate: Date;
  @Input() driverId: number;

  //define the event emitter
  @Output() routeChange = new EventEmitter<any>();
  // @Output() routeAddressStart: string;
  // @Output() routeAddressEnd: string;
  // @Output() isRouteCancelled: boolean;

  //Routes collected.
  routes: Route[];
  markedDates: Array<IMyMarkedDates> = new Array<IMyMarkedDates>();
  calDate: any = { jsdate: new Date() };
  minDate: IMyDate = { year: 2000, month: 1, day: 1 };
  calOptions: INgxMyDpOptions = {
    markCurrentDay: true,
    firstDayOfWeek: 'su',
    sunHighlight: false,
    disableUntil: this.minDate,
    markDates: this.markedDates
  };


  constructor(
    private routeData: RouteDataService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.calDate = {
      date: { year: this.selectedDate.getFullYear(), month: this.selectedDate.getMonth() + 1, day: this.selectedDate.getDate() },
      formatted: this.datePipe.transform(this.selectedDate, "yyyy-MM-dd")
    };

    if (this.minimumDate != undefined) {
      this.minDate = { year: this.minimumDate.getFullYear(), month: this.minimumDate.getMonth() + 1, day: this.minimumDate.getDate() };
    }

    this.loadRouteData();
    this.getMarkedDates();
  }

  getMarkedDates() {
    //Get Dates marked
    this.routeData.getRoutePickupDates().subscribe(res => {
      //Populate dates
      let md = new Array<IMyDate>();
      res.forEach(d => {
        let dt = new Date(d);
        md.push({ year: dt.getFullYear(), month: dt.getMonth() + 1, day: dt.getDate() });

      });

      //Set in callendar
      this.markedDates.push({ dates: md, color: 'green' });
    });
  }

  rChange(event) {
    this.loadRouteData();
  }

  routeDateChange(event: IMyDateModel) {
    this.selectedDate = event.jsdate;
    this.loadRouteData();
  }

  loadRouteData() {
    //Get Routes
    this.routeData.getRoutes(this.selectedDate, null, this.driverId).subscribe(result => {
      this.routes = result;

      //Set other properties
      this.routes.forEach(r => {
        //Assign Poly and dir
        if (r.routePricings) {
          r.routePricings.forEach(rp => {
            this.setPolyCoord(rp.boundary);
          });
        }
      });

      this.sendOutput();
    });
  }

  sendOutput() {
    //Find Route
    let r = this.routes.find(x => x.id == this.selectedRoute);
    this.selectedDate.setHours(0, 0, 0, 0);
    this.routeChange.emit({ currentRoute: this.selectedRoute, currentRouteObj: r, selectedDate: this.selectedDate });
  }

  setPolyCoord(bound: boundary) {
    //Loop through each boundary
    let poly = new Array<LatLngLiteral>();

    //sort
    bound.coordinates.sort((a, b) => a.coordinateOrder - b.coordinateOrder);

    //Convert to google lat/lng
    bound.coordinates.forEach(e => {
      poly.push({ lat: e.geoLat, lng: e.geoLong });
    });

    //Construct Google Poly
    let newpoly = new google.maps.Polygon({
      paths: poly,
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: bound.color,
      fillOpacity: 0.35
    });

    //Set it in the property
    bound.polyCoord = newpoly;
    bound.plainCoord = poly;
  }

  getBounds(poly: google.maps.Polygon): google.maps.LatLngBounds {
    let bounds = new google.maps.LatLngBounds();
    if (poly) {
      let paths = poly.getPaths();
      let path: any;
      for (let i = 0; i < paths.getLength(); i++) {
        path = paths.getAt(i);
        for (let ii = 0; ii < path.getLength(); ii++) {
          bounds.extend(path.getAt(ii));
        }
      }
    }
    return bounds;
  }
}
