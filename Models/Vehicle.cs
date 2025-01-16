using System;
using System.Collections.Generic;

namespace pathfinderRoute.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public Driver Driver { get; set; }
        public DateTime Added { get; set; }
        public string AddedBy { get; set; }
        public DateTime Modified { get; set; }
        public string ModifiedBy { get; set; }
        public List<Pickup> Pickups { get; set; }
    }
}