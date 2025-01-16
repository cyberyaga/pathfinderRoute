using System;

namespace pathfinderRoute.Models
{
    public class Driver
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        //public Vehicle Vehicle { get; set; }
        public DateTime Added { get; set; }
        public string AddedBy { get; set; }
        public DateTime Modified { get; set; }
        public string ModifiedBy { get; set; }

    }
}