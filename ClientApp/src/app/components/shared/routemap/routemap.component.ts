import { Component, OnInit, Input } from '@angular/core';
import { routeMapMarker, routeMapDirection } from './routeMapObj';

@Component({
  selector: 'app-routemap',
  templateUrl: './routemap.component.html',
  styleUrls: ['./routemap.component.css']
})
export class RoutemapComponent implements OnInit {

  @Input() getUserCoordinates = true;
  @Input() latitude = 40;
  @Input() longitude = -75;
  @Input() zoom = 10;
  @Input() showStreetView = false;
  @Input() showFullScreen = true;
  @Input() markers: Array<routeMapMarker>;
  @Input() direction: routeMapDirection;

  constructor() { }

  ngOnInit() {
    if (this.getUserCoordinates) {
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        });
      }
    }
  }

  mapReady(event) {
  }
}
