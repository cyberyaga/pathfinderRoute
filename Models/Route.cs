using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace pathfinderRoute.Models
{
    public class Route
    {
        public int Id { get; set; }
        public string RouteName { get; set; }
        public string RouteDescription { get; set; }
        public DateTime ScheduledDeparture { get; set; }
        public DateTime RouteStarts { get; set; }
        public DateTime? RouteExpires { get; set; }
        public decimal BasePrice { get; set; }
        public string FromAddress { get; set; }

        [Column(TypeName = "decimal(9, 6)")]
        public decimal FromGeoLat { get; set; }

        [Column(TypeName = "decimal(9, 6)")]
        public decimal FromGeoLong { get; set; }
        public string ToAddress { get; set; }

        [Column(TypeName = "decimal(9, 6)")]
        public decimal ToGeoLat { get; set; }

        [Column(TypeName = "decimal(9, 6)")]
        public decimal ToGeoLong { get; set; }
        public bool RouteDayMon { get; set; }
        public bool RouteDayTue { get; set; }
        public bool RouteDayWed { get; set; }
        public bool RouteDayThu { get; set; }
        public bool RouteDayFri { get; set; }
        public bool RouteDaySat { get; set; }
        public bool RouteDaySun { get; set; }
        public bool PricingBoundaryEnabled { get; set; }
        public DateTime Added { get; set; }
        public string AddedBy { get; set; }
        public DateTime Modified { get; set; }
        public string ModifiedBy { get; set; }
        public List<Pickup> Pickups { get; set; }
        //public int? VehicleId { get; set; }
        //public Vehicle Vehicle { get; set; }
        public List<RouteDay> RouteDays { get; set; }
        public List<RoutePricing> RoutePricings { get; set; }
    }
}