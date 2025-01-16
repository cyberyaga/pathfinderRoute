using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace pathfinderRoute.Models
{
    public class RouteDay
    {
        public int Id { get; set; }
        public DateTime RouteDate { get; set; }
        public int RouteId { get; set; }
        public Route Route { get; set; }
        public int? DriverId { get; set; }
        public Driver Driver { get; set; }
        public int? VehicleId { get; set; }
        public Vehicle Vehicle { get; set; }
        public bool IsCancelled { get; set; }
        // public DateTime? Cancelled { get; set; }
        // public string CancelledBy { get; set; }
    }
}