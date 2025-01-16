
import { Component, OnInit } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { RouteDataService } from '../../services/route-data.service';
import { Route } from '../../models/route';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { INgxMyDpOptions, IMyMarkedDates, IMyDate, IMyDateModel } from 'ngx-mydatepicker';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {
  routes: Route[];
  selectedDate: any;

  //Calendar Options
  markedDates: Array<IMyMarkedDates> = new Array<IMyMarkedDates>();
  calOptions: INgxMyDpOptions = {
    markCurrentDay: true,
    firstDayOfWeek: 'su',
    markDates: this.markedDates
  };

  constructor(
    private router: Router,
    private routeData: RouteDataService,
    private datePipe: DatePipe
  ) { 
    
  }

  ngOnInit() {
    let d = new Date();
    this.selectedDate = { 
      date: { year: d.getFullYear(), month: d.getMonth()+1, day: d.getDate() }, 
      formatted: this.datePipe.transform(d, "yyyy-MM-dd")
    };
    
    this.getMarkedDates();
    this.getRoutes(d);
  }

  getMarkedDates(){
    //Get Dates marked
    this.routeData.getRoutePickupDates().subscribe(res => {
      //Populate dates
      let md = new Array<IMyDate>();
      res.forEach(d => {
        let dt = new Date(d);
        md.push({ year: dt.getFullYear(), month: dt.getMonth()+1, day: dt.getDate() });        
        
      });
      
      //Set in callendar
      this.markedDates.push({ dates: md, color: 'green'});
    });
  }

  getRoutes(routeDate: Date){
    this.routeData.getRoutes(routeDate).subscribe(res => {
      this.routes = res;
    });
  }

  routeDateChange(event: IMyDateModel) {
    let d: Date = event.jsdate;
    this.selectedDate = event;
    this.getRoutes(event.jsdate);
  }

  routeClick(route: number) {
    // this.router.navigate(['/routes/route-view/' + route], { queryParams: { routeDate: this.selectedDate } });
    this.router.navigate(['/routes/route-view/' + route], { queryParams: { routeDate: this.selectedDate.formatted } });
  }
}
