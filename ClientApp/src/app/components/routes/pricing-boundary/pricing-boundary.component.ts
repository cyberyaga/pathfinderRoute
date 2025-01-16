
import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { PolygonManager } from '@agm/core';
import { MapLoaderService } from '../../../services/map-loader-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { boundary, boundaryCoord } from 'src/app/models/boundary';
import { RouteDataService } from 'src/app/services/route-data.service';
declare var google: any;

@Component({
  selector: 'app-pricing-boundary',
  templateUrl: './pricing-boundary.component.html',
  styleUrls: ['./pricing-boundary.component.css']
})
export class PricingBoundaryComponent implements OnInit, AfterViewInit {
  //==================Maps
  latitude = 40.613953;
  longitude = -75.477791;
  zoom = 10;
  currentLocation = { lat: this.latitude, lng: this.longitude };
  map: google.maps.Map;
  drawingManager: google.maps.drawing.DrawingManager;

  boundaries: boundary[];
  selectedBoundary: boundary;
  addEnabled = true;
  editEnabled = true;
  //public pman: PolygonManager;

  form = new FormGroup({
    boundaryId: new FormControl(),
    boundaryName: new FormControl('', Validators.required),
    color: new FormControl('#000000', Validators.required)
  });

  constructor(
    private routeData: RouteDataService
  ) { }

  ngOnInit() {
    this.getBoundaries();
  }

  ngAfterViewInit() {
    this.loadMap();
  }

  //TODO - Retrieve newly drawn polygon coordinates
  //TODO - Add New pricing boundary and save
  //DONE - Load existing boundaries with their colors.
  //TODO - Allow modifying of boundary and save.
  //TODO - Allow boundary delete.

  /*#region Main Methods */
  addNew() {
    //Reset Values
    this.form.reset();
    this.selectedBoundary = new boundary();
    this.drawPolygon();
    this.addEnabled = false;
    this.editEnabled = false;
    this.form.get('color').setValue('#000000');
  }

  edit(boundId: number) {
    //Reset Values
    this.form.reset();
    this.selectBoundary(boundId);

    this.addEnabled = false;
    this.editEnabled = false;
  }

  cancelAddEdit() {

    //If new boundary
    if (this.selectedBoundary && !this.selectedBoundary.id) {
      this.drawingManager.setMap(null);

      if (this.selectedBoundary.polyCoord) {
        this.selectedBoundary.polyCoord.setMap(null);
      }
    }

    //Reset Panel
    this.selectBoundary(0);
    this.addEnabled = true;
    this.editEnabled = true;
  }
  /*#endregion*/


  loadMap() {
    MapLoaderService.load().then(() => {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: this.latitude, lng: this.longitude },
        zoom: this.zoom,
        streetViewControl: false
      });

      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.currentLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
          this.map.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        });
      }
    })
  }

  getBoundaries() {
    this.routeData.getBoundaries(0, true).subscribe(result => {
      this.boundaries = result;

      //sort
      this.boundaries.sort((a, b) => a.name.localeCompare(b.name));
      //Loop through each boundary
      this.boundaries.forEach(bound => {
        let poly = [];

        //sort
        bound.coordinates.sort((a, b) => a.coordinateOrder - b.coordinateOrder);


        //Convert to google lat/lng
        bound.coordinates.forEach(e => {
          poly.push({ lat: e.geoLat, lng: e.geoLong });
        });

        // Construct the polygon.
        let newpoly = new google.maps.Polygon({
          id: bound.id,
          paths: poly,
          map: this.map,
          strokeColor: '#000000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: bound.color,
          fillOpacity: 0.35
        });

        // Loop through all paths in the polygon and add listeners
        // to them. If we just used `getPath()` then we wouldn't 
        // detect all changes to shapes like donuts.
        newpoly.getPaths().forEach((path, index) => {

          google.maps.event.addListener(path, 'insert_at', () => {
            // New point
            this.mvcArrayToboundaryCoord(path);
          });

          google.maps.event.addListener(path, 'remove_at', () => {
            // Point was removed
            this.mvcArrayToboundaryCoord(path);
          });

          google.maps.event.addListener(path, 'set_at', () => {
            // Point was moved
            this.mvcArrayToboundaryCoord(path);
          });

        });

        // google.maps.event.addListener(newpoly, 'dragend', function () {
        //   // Polygon was dragged
        //   //newpoly
        // });

        //Set it in the property
        bound.polyCoord = newpoly;
      });
    });
  }

  clearBoundaries() {
    // if (this.selectedBoundary) {
    //   this.selectedBoundary.polyCoord.setMap(null);
    // }
    this.boundaries.forEach(bound => {
      if (bound.polyCoord) {
        bound.polyCoord.setMap(null);
      }
    });
  }

  selectBoundary(id: number) {
    // Reset Colors
    this.boundaries.forEach(x => {
      if (x.polyCoord) {
        x.polyCoord.setOptions({
          fillColor: x.color,
          draggable: false,
          editable: false
        });
      }
    });

    //Change selected
    let bound = this.boundaries.find(x => x.id == id);
    this.selectedBoundary = bound;
    if (bound) {
      this.form.get("boundaryId").setValue(bound.id);
      this.form.get("boundaryName").setValue(bound.name);
      this.form.get("color").setValue(bound.color);
      if (bound.polyCoord) {
        bound.polyCoord.setOptions({
          fillColor: "#000000",
          draggable: false,
          editable: true
        });
      }
      //zoom in
      this.map.fitBounds(this.getBounds(bound.polyCoord));
    }
  }

  getBounds(poly: google.maps.Polygon): google.maps.LatLngBounds {
    var bounds = new google.maps.LatLngBounds();
    var paths = poly.getPaths();
    var path;
    for (var i = 0; i < paths.getLength(); i++) {
      path = paths.getAt(i);
      for (var ii = 0; ii < path.getLength(); ii++) {
        bounds.extend(path.getAt(ii));
      }
    }
    return bounds;
  }

  drawPolygon() {
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      },
      polygonOptions: {
        draggable: true,
        editable: true
      }
    });

    this.drawingManager.setMap(this.map);
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
      // Polygon drawn
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        //this is the coordinate, you can assign it to a variable or pass into another function.
        this.selectedBoundary.polyCoord = event.overlay;
        this.selectedBoundary.coordinates = this.pathsToboundaryCoord(event.overlay);
      }
    });
  }

  pathsToboundaryCoord(poly: google.maps.Polygon): Array<boundaryCoord> {
    let paths = new Array<boundaryCoord>();

    if (poly) {
      const vertices = poly.getPaths().getArray()[0];
      let order: number = 0;
      vertices.getArray().forEach((xy) => {
        let latLng: boundaryCoord = {
          geoLat: xy.lat(),
          geoLong: xy.lng(),
          coordinateOrder: order
        };
        paths.push(latLng);
        order++;
      });
    }
    return paths;
  }

  mvcArrayToboundaryCoord(mvcarray: any) {
    let paths = new Array<boundaryCoord>();

    if (mvcarray) {
      let order: number = 0;
      mvcarray.getArray().forEach((xy) => {
        let latLng: boundaryCoord = {
          geoLat: xy.lat(),
          geoLong: xy.lng(),
          coordinateOrder: order
        };
        paths.push(latLng);
        order++;
      });
    }

    this.selectedBoundary.coordinates = paths;
  }

  submit(f) {
    let b = new boundary();
    b.id = f.boundaryId == null ? 0 : f.boundaryId;
    b.name = f.boundaryName;
    b.color = f.color;
    b.coordinates = this.selectedBoundary.coordinates;

    this.routeData.updateBoundary(b).subscribe(result => {
      //Reset Panel
      this.cancelAddEdit();
      this.clearBoundaries();
      this.getBoundaries();
    });
  }
}