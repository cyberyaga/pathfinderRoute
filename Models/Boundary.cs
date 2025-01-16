using System;
using System.Collections.Generic;

namespace pathfinderRoute.Models
{
    public class Boundary
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public List<BoundaryCoordinate> Coordinates { get; set; }
    }
}