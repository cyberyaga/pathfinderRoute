using System;
using System.Collections.Generic;

namespace pathfinderRoute.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public bool SMSEnabled { get; set; }
        public string Notes { get; set; }
        public DateTime Added { get; set; }
        public string AddedBy { get; set; }
        public DateTime Modified { get; set; }
        public string ModifiedBy { get; set; }
        public List<Pickup> Pickups { get; set; }
        public List<CustomerAddress> CustomerAddresses { get; set; }
    }
}