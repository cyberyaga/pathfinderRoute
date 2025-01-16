using System;
using System.Collections.Generic;

namespace pathfinderRoute.Models
{
    public class Pickup
    {
        public int Id { get; set; }
        public DateTime? PickupTime { get; set; }
        public bool PickupASAP { get; set; }
        public int NumberOfPassengers { get; set; }
        public string Notes { get; set; }
        public decimal CalculatedPrice { get; set; }
        public decimal Price { get; set; }
        public DateTime Added { get; set; }
        public string AddedBy { get; set; }
        public DateTime Modified { get; set; }
        public string ModifiedBy { get; set; }
        public bool IsCancelled { get; set; }
        public DateTime? Cancelled { get; set; }
        public string CancelledBy { get; set; }
        public bool IsConfirmed { get; set; }
        public DateTime? Confirmed { get; set; }
        public string ConfirmedBy { get; set; }
        public bool IsMoved { get; set; }
        public DateTime? Moved { get; set; }
        public string MovedBy { get; set; }
        public int? RouteId { get; set; }
        public Route Route { get; set; }
        public Vehicle Vehicle { get; set; }
        public int CustomerId { get; set; }
        public Customer Customer { get; set; }
        public List<PickupAddress> PickupAddresses { get; set; }
    }
}