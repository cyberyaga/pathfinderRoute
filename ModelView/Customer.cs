using System.Collections.Generic;

namespace pathfinderRoute.ModelsView
{
    public class Customer
    {
        public int id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string phoneNumber { get; set; }
        public bool smsEnabled { get; set; }
        public List<CustomerAddress> CustomerAddress { get; set; }
    }
}