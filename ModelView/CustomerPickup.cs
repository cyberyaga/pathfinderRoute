using System;
using System.Collections.Generic;
using pathfinderRoute.Models;

namespace pathfinderRoute.ModelsView
{
    public class CustomerPickup
    {
        public int Id { get; set; }
        public string CustomerName { get; set; }
        public int CustomerId { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime? PickupTime { get; set; }
        public DateTime? Cancelled { get; set; }
        public bool IsCancelled { get; set; }
        public DateTime? Confirmed { get; set; }
        public bool IsConfirmed { get; set; }
        public double WaitTime { get; set; }
        public int NumberOfPassengers { get; set; }
        public string Notes { get; set; }
        public decimal Price { get; set; }
        public int? RouteId { get; set; }
        public string RouteName { get; set; }
        public List<Address> Addresses { get; set; }

        public class Address
        {
            public int Sequence { get; set; }
            public string Address1 { get; set; }
            public string Address2 { get; set; }
            public string City { get; set; }
            public string State { get; set; }
            public string ZipCode { get; set; }
            public decimal GeoLat { get; set; }
            public decimal GeoLong { get; set; }
        }

        public CustomerPickup()
        {
            this.Addresses = new List<Address>();
        }

        public CustomerPickup(Pickup p)
        {
            if (this.Addresses == null)
            {
                this.Addresses = new List<Address>();
            }

            this.Id = p.Id;
            if (p.Customer != null)
            {
                this.CustomerName = p.Customer.FirstName + " " + p.Customer.LastName;
                this.PhoneNumber = p.Customer.PhoneNumber;
            }
            this.CustomerId = p.CustomerId;
            this.DateAdded = p.Added;
            this.PickupTime = p.PickupTime;
            this.Cancelled = p.Cancelled;
            this.IsCancelled = p.IsCancelled;
            this.Confirmed = p.Confirmed;
            this.IsConfirmed = p.IsConfirmed;
            this.NumberOfPassengers = p.NumberOfPassengers;
            this.Notes = p.Notes;
            this.RouteId = p.RouteId;
            this.Price = p.Price;
            if (p.Route != null)
            {
                this.RouteName = p.Route.RouteName;
            }
            this.WaitTime = this.WaitTime = DateTime.Now.Subtract(this.DateAdded).TotalMinutes;

            //Addresses
            if (p.PickupAddresses != null)
            {
                p.PickupAddresses.ForEach(x =>
                {
                    this.Addresses.Add(new Address()
                    {
                        Sequence = x.Sequence,
                        Address1 = x.Address1,
                        Address2 = x.Address2,
                        City = x.City,
                        State = x.State,
                        ZipCode = x.ZipCode,
                        GeoLat = x.GeoLat,
                        GeoLong = x.GeoLong
                    });
                });
            }
        }
    }
}