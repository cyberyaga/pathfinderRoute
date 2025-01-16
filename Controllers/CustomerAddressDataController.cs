using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using pathfinderRoute.Models;

namespace pathfinderRoute.Controllers
{
    [Route("api/[controller]")]
    public class CustomerAddressDataController : Controller
    {

        private readonly ApplicationDbContext db;
        public CustomerAddressDataController(ApplicationDbContext context)
        {
            db = context;
        }


        [HttpGet("[action]")]
        public List<CustomerAddress> GetCustomerAddresses(int CustomerId)
        {
            return db.CustomerAddresses.Where(x => x.Customer.Id == CustomerId).ToList();
        }

        [HttpGet("[action]")]
        public CustomerAddress GetCustomerAddress(int CustAddressID)
        {
            return db.CustomerAddresses.Find(CustAddressID);
        }

        [HttpPost("[action]")]
        public IActionResult AddCustomerAddress([FromBody] CustomerAddress c)
        {
            try
            {
                c.Added = DateTime.Now;
                c.Modified = DateTime.Now;

                db.CustomerAddresses.Add(c);
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
        public IActionResult UpdateCustomerAddress([FromBody] CustomerAddress c)
        {
            try
            {
                var a = db.CustomerAddresses.Find(c.Id);

                a.Address1 = c.Address1;
                a.Address2 = c.Address2;
                a.City = c.City;
                a.State = c.State;
                a.ZipCode = c.ZipCode;
                a.GeoLat = c.GeoLat;
                a.GeoLong = c.GeoLong;
                a.Modified = DateTime.Now;

                if (db.SaveChanges() > 0)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest("Error: No records were updated.");
                }
            }
            catch (System.Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }
    }
}