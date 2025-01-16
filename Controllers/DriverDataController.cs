using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using pathfinderRoute.Models;

namespace pathfinderRoute.Controllers
{
    [Route("api/[controller]")]
    public class DriverDataController : Controller
    {

        private readonly ApplicationDbContext db;
        public DriverDataController(ApplicationDbContext context)
        {
            db = context;
        }

        [HttpGet("[action]")]
        public List<Driver> GetDrivers()
        {
            List<Driver> ds = new List<Driver>();

            try
            {
                ds = db.Drivers.ToList();
            }
            catch { }

            return ds;
        }

        [HttpGet("[action]")]
        public List<Driver> SearchDrivers(string search)
        {
            List<Driver> ds = new List<Driver>();

            try
            {
                ds = db.Drivers.Where(x => (x.FirstName + " " + x.LastName).Contains(search)).ToList();
            }
            catch { }


            return ds;
        }
        [HttpGet("[action]")]
        public Driver GetDriver(int DriverId)
        {
            Driver d = new Driver();

            try
            {
                d = db.Drivers.Find(DriverId);
            }
            catch { }


            return d;
        }

        [HttpPost("[action]")]
        public IActionResult AddDriver([FromBody] Driver d)
        {
            try
            {
                d.Added = DateTime.Now;
                d.Modified = DateTime.Now;
                db.Drivers.Add(d);
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
        public IActionResult UpdateDriver([FromBody] Driver c)
        {
            try
            {

                var u = db.Drivers.Find(c.Id);
                if (u != null)
                {
                    u.FirstName = c.FirstName;
                    u.LastName = c.LastName;

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