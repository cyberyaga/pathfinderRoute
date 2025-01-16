using pathfinderRoute.Models;

namespace pathfinderRoute.ModelsView
{
    public class VehicleView
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public Driver driver { get; set; }
        public int AssignedRouteId { get; set; }
        public class Driver
        {
            public int Id { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
        }
        public void ConvertFromVehicle(Vehicle v)
        {
            this.Id = v.Id;
            this.Description = v.Description;
            this.Capacity = v.Capacity;
            // if (v.Route != null)
            // {
            //     AssignedRouteId = v.Route.Id;
            // }

            if (v.Driver != null)
            {
                this.driver = new Driver();
                this.driver.Id = v.Driver.Id;
                this.driver.FirstName = v.Driver.FirstName;
                this.driver.LastName = v.Driver.LastName;
            }
        }
    }
}