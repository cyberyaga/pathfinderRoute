using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using pathfinderRoute.Models;

namespace pathfinderRoute.ModelsView
{
    public class BoundaryView
    {
        public BoundaryView()
        {
            this.Coordinates = new List<BoundaryCoordinates>();
        }

        public BoundaryView(Boundary b)
        {
            this.Coordinates = new List<BoundaryCoordinates>();

            this.Id = b.Id;
            this.Color = b.Color;
            this.Name = b.Name;
            if (b.Coordinates != null)
            {
                b.Coordinates.ForEach(x =>
                {
                    this.Coordinates.Add(new BoundaryCoordinates()
                    {
                        GeoLat = x.GeoLat,
                        GeoLong = x.GeoLong,
                        CoordinateOrder = x.CoordinateOrder
                    });
                });
            }
        }

        public int? Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public List<BoundaryCoordinates> Coordinates { get; set; }

        public class BoundaryCoordinates
        {
            [Column(TypeName = "decimal(9,6)")]
            public decimal GeoLat { get; set; }

            [Column(TypeName = "decimal(9,6)")]
            public decimal GeoLong { get; set; }
            public int CoordinateOrder { get; set; }
        }

        public void ConvertFromBoundary(Boundary b)
        {
            this.Id = b.Id;
            this.Color = b.Color;
            this.Name = b.Name;
            if (b.Coordinates != null)
            {
                b.Coordinates.ForEach(x =>
                {
                    this.Coordinates.Add(new BoundaryCoordinates()
                    {
                        GeoLat = x.GeoLat,
                        GeoLong = x.GeoLong,
                        CoordinateOrder = x.CoordinateOrder
                    });
                });
            }
        }
    }
}
