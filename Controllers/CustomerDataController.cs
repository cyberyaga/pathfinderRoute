using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pathfinderRoute.Models;

namespace pathfinderRoute.Controllers
{
    [Route("api/[controller]")]
    public class CustomerDataController : Controller
    {
        private readonly ApplicationDbContext db;
        public CustomerDataController(ApplicationDbContext context)
        {
            db = context;
        }

        [HttpGet("[action]")]
        public List<ModelsView.Customer> GetCustomers(string term)
        {
            if (string.IsNullOrWhiteSpace(term))
            {
                return null;//db.Customers.Take(10).ToList();
            }
            else
            {
                term = term.ToUpper();

                return (from x in db.Customers.Include(i => i.CustomerAddresses)
                        where (x.FirstName + " " + x.LastName).ToUpper().Contains(term) || x.PhoneNumber.Contains(term)
                        select new ModelsView.Customer
                        {
                            id = x.Id,
                            firstName = x.FirstName,
                            lastName = x.LastName,
                            phoneNumber = x.PhoneNumber,
                            smsEnabled = x.SMSEnabled,
                            CustomerAddress = (from s in x.CustomerAddresses
                                               select new ModelsView.CustomerAddress
                                               {
                                                   Address1 = s.Address1,
                                                   Address2 = s.Address2,
                                                   City = s.City,
                                                   State = s.State,
                                                   ZipCode = s.ZipCode,
                                                   GeoLat = s.GeoLat,
                                                   GeoLong = s.GeoLong
                                               }).ToList()
                        }).ToList();


                // return db.Customers.Where(x =>
                //     (x.FirstName + " " + x.LastName).ToUpper().Contains(term) || x.PhoneNumber.Contains(term)
                //     ).ToList();
            }
        }

        [HttpGet("[action]")]
        public List<ModelsView.Customer> GetCustomer(int CustID)
        {
            var temp = new List<ModelsView.Customer>();
            var c = (from x in db.Customers
                     where x.Id == CustID
                     select new ModelsView.Customer
                     {
                         id = x.Id,
                         firstName = x.FirstName,
                         lastName = x.LastName,
                         phoneNumber = x.PhoneNumber,
                         smsEnabled = x.SMSEnabled,
                         CustomerAddress = (from s in x.CustomerAddresses
                                            select new ModelsView.CustomerAddress
                                            {
                                                Address1 = s.Address1,
                                                Address2 = s.Address2,
                                                City = s.City,
                                                State = s.State,
                                                ZipCode = s.ZipCode,
                                                GeoLat = s.GeoLat,
                                                GeoLong = s.GeoLong
                                            }).ToList()
                     }).SingleOrDefault();
            temp.Add(c);
            return temp;
        }

        [HttpGet("[action]")]
        public async Task<List<ModelsView.CustomerPickup>> GetCustomerPickups(int CustID)
        {
            return await (from x in db.Pickups.Include(i => i.PickupAddresses).Include(r => r.Route)
                          where x.CustomerId == CustID && !x.IsMoved
                          orderby x.Added descending
                          select new ModelsView.CustomerPickup(x)).ToListAsync();
        }

        [HttpPost("[action]")]
        public IActionResult AddCustomer([FromBody] Customer c)
        {
            try
            {

                c.Added = DateTime.Now;
                c.Modified = DateTime.Now;
                db.Customers.Add(c);
                if (db.SaveChanges() > 0)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest("Error: No records were added.");
                }
            }
            catch (System.Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }
        [HttpPost("[action]")]
        public IActionResult UpdateCustomer([FromBody] Customer c)
        {
            try
            {

                var u = db.Customers.Find(c.Id);
                if (u != null)
                {
                    u.FirstName = c.FirstName;
                    u.LastName = c.LastName;
                    u.PhoneNumber = c.PhoneNumber;
                    u.SMSEnabled = c.SMSEnabled;

                    //DateStamp
                    u.Modified = DateTime.Now;

                    if (db.SaveChanges() > 0)
                    {
                        return Ok();
                    }
                    else
                    {
                        return BadRequest("Error: No records were added.");
                    }
                }
                else
                {
                    return BadRequest("Error: Unable to locate the user record.");
                }
            }
            catch (System.Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }
    }
}