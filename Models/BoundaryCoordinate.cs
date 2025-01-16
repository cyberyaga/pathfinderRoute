using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace pathfinderRoute.Models
{
    public class BoundaryCoordinate
    {
        public int Id { get; set; }
        public int BoundaryId { get; set; }
        public Boundary Boundary { get; set; }

        [Column(TypeName = "decimal(9,6)")]
        public decimal GeoLat { get; set; }

        [Column(TypeName = "decimal(9,6)")]
        public decimal GeoLong { get; set; }

        public int CoordinateOrder { get; set; }
    }
}