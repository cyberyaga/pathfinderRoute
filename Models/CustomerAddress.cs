using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace pathfinderRoute.Models
{
    public class CustomerAddress
    {
        public int Id { get; set; }
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
        public int CustomerId { get; set; }
        public Customer Customer { get; set; }
    }
}