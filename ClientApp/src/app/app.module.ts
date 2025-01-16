import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { CollapseModule, AlertModule } from 'ngx-bootstrap';


import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomeComponent } from './components/home/home.component';
import { CustomersComponent } from './components/customers/customers.component';
import { DriversComponent } from './components/drivers/drivers.component';
import { RoutesComponent } from './components/routes/routes.component';
import { CustomerAddressComponent } from './components/customers/customer-address/customer-address.component';
import { PickupsComponent } from './components/pickups/pickups.component';
import { PickupsAddComponent } from './components/pickups/pickups-add/pickups-add.component';
import { CustomerInfoComponent } from './components/customers/customer-info/customer-info.component';
import { PickupsOptionsComponent } from './components/pickups/pickups-options/pickups-options.component';
import { RouteAddComponent } from './components/routes/route-manager/route-add/route-add.component';
import { RouteViewComponent } from './components/routes/route-view/route-view.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { RouteManagerComponent } from './components/routes/route-manager/route-manager.component';
import { PricingBoundaryComponent } from './components/routes/pricing-boundary/pricing-boundary.component';
import { AdminComponent } from './components/admin/admin.component';
import { AppOptionsComponent } from './components/admin/app-options/app-options.component';
import { RoutePickerComponent } from './components/routes/route-picker/route-picker.component';
import { AuthCallbackComponent } from './services/security/auth-callback/auth-callback.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { UsermanagerComponent } from './components/admin/usermanager/usermanager.component';
import { AccessdeniedComponent } from './components/errors/access-denied/access-denied.component';
import { AuthGuardService } from './services/security/auth-guard.service';
import { PRouteDbserviceService } from './services/p-route-dbservice.service';
import { MessageService } from './services/message.service';
import { DriverDataService } from './services/driver-data.service';
import { CustomerDataService } from './services/customer-data.service';
import { PickupDataService } from './services/pickup-data.service';
import { RouteDataService } from './services/route-data.service';
import { VehicleDataService } from './services/vehicle-data.service';
import { AuthService } from './services/security/auth.service';
import { AdminDataService } from './services/admin-data.service';
import { DatePipe } from '@angular/common';
import { AssignedRoutesComponent } from './components/drivers/assigned-routes/assigned-routes.component';
import { EmailService } from './services/email.service';
import { RoutemapComponent } from './components/shared/routemap/routemap.component';
import { AddresautocompleteComponent } from './components/shared/addresautocomplete/addresautocomplete.component';
import { LoadingComponent } from './components/shared/loading/loading.component';
import { PasswordresetComponent } from './components/userpreference/passwordreset/passwordreset.component';
import { PageNotFoundComponent } from './components/errors/page-not-found/page-not-found.component';
import { UserManager } from 'oidc-client';
import { UserPreferenceService } from './services/user-preference.service';
import { PreferencehomeComponent } from './components/userpreference/preferencehome/preferencehome.component';



@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CustomersComponent,
    DriversComponent,
    RoutesComponent,
    CustomerAddressComponent,
    PickupsComponent,
    PickupsAddComponent,
    CustomerInfoComponent,
    PickupsOptionsComponent,
    RouteAddComponent,
    RouteViewComponent,
    VehiclesComponent,
    RouteManagerComponent,
    PricingBoundaryComponent,
    AdminComponent,
    AppOptionsComponent,
    RoutePickerComponent,
    AuthCallbackComponent,
    UserInfoComponent,
    UsermanagerComponent,
    AccessdeniedComponent,
    AssignedRoutesComponent,
    PricingBoundaryComponent,
    RoutemapComponent,
    AddresautocompleteComponent,
    LoadingComponent,
    PasswordresetComponent,
    PageNotFoundComponent,
    PreferencehomeComponent
  ],
  entryComponents: [
    CustomerAddressComponent,
    CustomerInfoComponent,
    PickupsOptionsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMyDatePickerModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAvy31VCoLOH7_rxu28Oz1h4q3_QjomruM',
      libraries: ['places']
    }),
    AgmDirectionModule,
    BrowserAnimationsModule,
    TabsModule.forRoot(),
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'pickups', component: PickupsComponent, canActivate: [AuthGuardService] },
      { path: 'pickups/pickups-add', component: PickupsAddComponent, canActivate: [AuthGuardService] },
      { path: 'routes', component: RoutesComponent, canActivate: [AuthGuardService] },
      { path: 'routes/route-view/:id', component: RouteViewComponent, canActivate: [AuthGuardService] },//, data: { expectedRole: [ "Manager", "Dispatcher" ] } },
      { path: 'routes/route-manager', component: RouteManagerComponent, canActivate: [AuthGuardService] },
      { path: 'routes/route-manager/route-add', component: RouteAddComponent, canActivate: [AuthGuardService] },
      { path: 'routes/route-manager/route-add/:id', component: RouteAddComponent, canActivate: [AuthGuardService] },
      { path: 'routes/pricing-boundary', component: PricingBoundaryComponent, canActivate: [AuthGuardService] },
      { path: 'customers', component: CustomersComponent, canActivate: [AuthGuardService] },
      { path: 'customers/:id', component: CustomersComponent, canActivate: [AuthGuardService] },
      { path: 'drivers', component: DriversComponent, canActivate: [AuthGuardService] },
      { path: 'drivers/assigned-routes', component: AssignedRoutesComponent, canActivate: [AuthGuardService] },
      { path: 'vehicles', component: VehiclesComponent, canActivate: [AuthGuardService] },
      { path: 'customer-address/:id', component: CustomerAddressComponent, canActivate: [AuthGuardService] },
      { path: 'admin', component: AdminComponent, canActivate: [AuthGuardService] },
      { path: 'admin/usermanager', component: UsermanagerComponent, canActivate: [AuthGuardService] },
      { path: 'userpreference', component: PreferencehomeComponent, canActivate: [AuthGuardService] },
      { path: 'userpreference/passwordreset', component: PasswordresetComponent },
      { path: 'auth-callback', component: AuthCallbackComponent },
      { path: 'errors/accessdenied', component: AccessdeniedComponent, canActivate: [AuthGuardService] },
      { path: '**', component: PageNotFoundComponent }
    ])
  ],
  providers: [
    PRouteDbserviceService,
    MessageService,
    DriverDataService,
    CustomerDataService,
    PickupDataService,
    RouteDataService,
    VehicleDataService,
    AuthGuardService,
    AuthService,
    AdminDataService,
    UserPreferenceService,
    EmailService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
