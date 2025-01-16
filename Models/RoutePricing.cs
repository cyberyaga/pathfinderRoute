using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace pathfinderRoute.Models
{
    public class RoutePricing
    {
        public int Id { get; set; }
        public decimal AdditionalCost { get; set; }

        public bool IsFrom { get; set; }
        public bool IsTo { get; set; }
        public int boundaryId { get; set; }
        public Boundary boundary { get; set; }
        public Route route { get; set; }

    }
}