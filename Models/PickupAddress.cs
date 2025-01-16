using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;

namespace pathfinderRoute.Models
{
    public class PickupAddress
    {
        public int Id { get; set; }
        public int Sequence { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }

        [Column(TypeName = "decimal(9, 6)")]
        public decimal GeoLat { get; set; }

        [Column(TypeName = "decimal(9, 6)")]
        public decimal GeoLong { get; set; }
        public DateTime Added { get; set; }
        public string AddedBy { get; set; }
        public DateTime Modified { get; set; }
        public string ModifiedBy { get; set; }
        public int PickupId { get; set; }
        public Pickup Pickup { get; set; }
    }
}