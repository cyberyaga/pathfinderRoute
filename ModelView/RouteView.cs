
using System;
using System.Collections.Generic;
using System.Linq;
using pathfinderRoute.Models;

namespace pathfinderRoute.ModelsView
{
    public class RouteView
    {
        public int Id { get; set; }
        public string RouteName { get; set; }
        public int PickupCount { get; set; }
        public int PickupCountConfirmed { get; set; }
        public int PassengerCount { get; set; }
        public DateTime scheduledDeparture { get; set; }
        public string FromAddress { get; set; }
        public string ToAddress { get; set; }
        public int VehicleId { get; set; }
        public string AssignedVehicle { get; set; }
        public int VehicleCapacity { get; set; }
        public int DriverId { get; set; }
        public string DriverName { get; set; }
        public bool IsCancelled { get; set; }
        public int RouteDayId { get; set; }
        public bool RouteDayMon { get; set; }
        public bool RouteDayTue { get; set; }
        public bool RouteDayWed { get; set; }
        public bool RouteDayThu { get; set; }
        public bool RouteDayFri { get; set; }
        public bool RouteDaySat { get; set; }
        public bool RouteDaySun { get; set; }
        public DateTime RouteStarts { get; set; }
        public DateTime? RouteExpires { get; set; }
        public decimal BasePrice { get; set; }
        public bool PricingBoundaryEnabled { get; set; }
        public List<CustomerPickup> Pickups { get; set; }
        public List<RoutePricingView> RoutePricings { get; set; }

        public RouteView()
        {

        }

        public RouteView(Route r, DateTime? rtDate, RouteDay rd)
        {
            this.Id = r.Id;
            this.RouteName = r.RouteName;
            this.PickupCount = rtDate.HasValue ? r.Pickups.Where(x => x.PickupTime.Value.Date == rtDate && !x.IsCancelled && !x.IsMoved).Count() : 0;
            this.PickupCountConfirmed = rtDate.HasValue ? r.Pickups.Where(x => x.PickupTime.Value.Date == rtDate && !x.IsCancelled && !x.IsMoved && x.IsConfirmed).Count() : 0;
            this.PassengerCount = rtDate.HasValue ? r.Pickups.Where(x => x.PickupTime.Value.Date == rtDate && !x.IsCancelled && !x.IsMoved).Sum(s => (int?)s.NumberOfPassengers) ?? 0 : 0;
            this.scheduledDeparture = r.ScheduledDeparture;
            this.FromAddress = r.FromAddress;
            this.ToAddress = r.ToAddress;
            this.VehicleId = (rd != null && rd.VehicleId.HasValue) ? rd.VehicleId.Value : 0;
            this.AssignedVehicle = (rd != null && rd.VehicleId.HasValue && rd.Vehicle != null) ? rd.Vehicle.Description : "";
            this.VehicleCapacity = (rd != null && rd.VehicleId.HasValue && rd.Vehicle != null) ? rd.Vehicle.Capacity : 0;
            this.DriverId = (rd != null && rd.DriverId.HasValue) ? rd.DriverId.Value : 0;
            this.DriverName = (rd != null && rd.DriverId.HasValue) ? rd.Driver.FirstName + " " + rd.Driver.LastName : "";
            this.IsCancelled = (rd != null) ? rd.IsCancelled : false;
            this.RouteDayId = (rd != null) ? rd.Id : 0;
            this.RouteDaySun = r.RouteDaySun;
            this.RouteDayMon = r.RouteDayMon;
            this.RouteDayTue = r.RouteDayTue;
            this.RouteDayWed = r.RouteDayWed;
            this.RouteDayThu = r.RouteDayThu;
            this.RouteDayFri = r.RouteDayFri;
            this.RouteDaySat = r.RouteDaySat;
            this.RouteStarts = r.RouteStarts;
            this.RouteExpires = r.RouteExpires;
            this.BasePrice = r.BasePrice;
            this.PricingBoundaryEnabled = r.PricingBoundaryEnabled;
            this.RoutePricings = r.RoutePricings.Select(p => new RoutePricingView(p)).ToList();//(r.RoutePricings != null && r.RoutePricings.Count() > 0) ? r.RoutePricings.ForEach(p => new RoutePricingView(p)) : new List<RouteDayView>();
        }
    }

    public class RoutePricingView
    {
        public int Id { get; set; }
        public decimal AdditionalCost { get; set; }
        public bool IsFrom { get; set; }
        public bool IsTo { get; set; }
        public int BoundaryId { get; set; }
        public string BoundaryName { get; set; }
        public BoundaryView boundary { get; set; }

        public RoutePricingView(RoutePricing p)
        {
            this.Id = p.Id;
            this.AdditionalCost = p.AdditionalCost;
            this.IsFrom = p.IsFrom;
            this.IsTo = p.IsTo;
            this.BoundaryId = p.boundary != null ? p.boundary.Id : 0;
            this.BoundaryName = p.boundary != null ? p.boundary.Name : null;
            this.boundary = p.boundary != null ? new BoundaryView(p.boundary) : new BoundaryView();
        }
    }
}