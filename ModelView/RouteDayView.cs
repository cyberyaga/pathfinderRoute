using System;

namespace pathfinderRoute.ModelsView
{
    public class RouteDayView
    {
        public int? Id { get; set; }
        public int RouteId { get; set; }
        public DateTime RouteDate { get; set; }
        public int? VehicleId { get; set; }
        public int? DriverId { get; set; }
        public bool IsCancelled { get; set; }
    }
}