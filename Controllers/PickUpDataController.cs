using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pathfinderRoute.Models;
using pathfinderRoute.ModelsView;

namespace pathfinderRoute.Controllers
{
    [Route("api/[controller]")]
    public class PickUpDataController : Controller
    {
        private readonly ApplicationDbContext db;
        public PickUpDataController(ApplicationDbContext context)
        {
            db = context;
        }

        [HttpGet("[action]")]
        public async Task<List<CustomerPickup>> GetPendingPickups()
        {
            return await (from p in db.Pickups.Include(x => x.Customer).Include(x => x.PickupAddresses)
                          where p.RouteId == null && p.Vehicle == null && !p.IsCancelled
                          select new CustomerPickup(p)).ToListAsync();
        }

        [HttpGet("[action]")]
        public async Task<List<CustomerPickup>> GetAssignedPickups()
        {
            return await (from p in db.Pickups.Include(x => x.Customer).Include(x => x.PickupAddresses)
                          where p.RouteId == null && p.Vehicle != null //Has a driver
                          select new CustomerPickup(p)).ToListAsync();
        }

        [HttpGet("[action]")]
        public async Task<List<CustomerPickup>> GetRecentPickups()
        {
            return await (from p in db.Pickups.Include(x => x.Customer).Include(x => x.PickupAddresses)
                          where p.RouteId == null && p.Vehicle != null //Has a driver
                          select new CustomerPickup(p)).ToListAsync();
        }

        [HttpGet("[action]")]
        public async Task<List<CustomerPickup>> GetRecentCancels()
        {
            return await (from p in db.Pickups.Include(x => x.Customer).Include(x => x.PickupAddresses)
                          where p.RouteId == null && p.IsCancelled //is Cancelled
                          select new CustomerPickup(p)).ToListAsync();
        }

        [HttpGet("[action]")]
        public async Task<List<CustomerPickup>> GetRecentCompleted()
        {
            return await (from p in db.Pickups.Include(x => x.Customer).Include(x => x.PickupAddresses)
                          where p.RouteId == null && p.Vehicle != null //Has a driver
                          select new CustomerPickup(p)).ToListAsync();
        }

        [HttpPost("[action]")]
        public IActionResult AddCustomerPickup([FromBody] Pickup p)
        {
            if (p == null)
            {
                return BadRequest("Error: Request is not valid.");
            }
            try
            {
                if (p.Customer.Id != 0)
                {
                    p.CustomerId = p.Customer.Id;
                    p.Customer = null;
                }
                else //Create new Customer
                {
                    //Set Customer Properties
                    p.Customer.Added = DateTime.Now;
                    p.Customer.Modified = DateTime.Now;

                    //Add Pickup Address
                    var pa = p.PickupAddresses.FirstOrDefault(x => x.Sequence == 0);
                    if (pa != null)
                    {
                        var ca = new Models.CustomerAddress();
                        ca.Address1 = pa.Address1;
                        ca.Address2 = pa.Address2;
                        ca.City = pa.City;
                        ca.State = pa.State;
                        ca.ZipCode = pa.ZipCode;
                        ca.GeoLat = pa.GeoLat;
                        ca.GeoLong = pa.GeoLong;
                        ca.Added = DateTime.Now;
                        ca.Modified = DateTime.Now;

                        if (p.Customer.CustomerAddresses == null)
                        {
                            p.Customer.CustomerAddresses = new List<Models.CustomerAddress>();
                        }

                        p.Customer.CustomerAddresses.Add(ca);
                    }
                }

                p.Added = DateTime.Now;
                p.Modified = DateTime.Now;
                p.PickupAddresses.ForEach(e =>
                {
                    e.Added = DateTime.Now;
                    e.Modified = DateTime.Now;
                });

                db.Pickups.Add(p);

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

        [HttpDelete("[action]/{pickupId}")]
        public async Task<IActionResult> CancelCustomerPickup(int PickupId)
        {
            try
            {
                var c = await db.Pickups.FindAsync(PickupId);
                c.IsCancelled = true;
                c.Cancelled = DateTime.Now;
                await db.SaveChangesAsync();
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> MoveCustomerPickup([FromBody] PickupMoveView r)
        {
            try
            {
                //Get Pickup
                Pickup p = await db.Pickups.Include(x => x.PickupAddresses).FirstOrDefaultAsync(x => x.Id == r.PickupId);
                if (p == null)
                {
                    return BadRequest("Error: Unable to find record of pickup.");
                }

                //Flag as moved.
                p.IsMoved = true;
                p.Moved = DateTime.Now;

                //Create New Pickup
                Pickup NP = new Pickup()
                {
                    Added = DateTime.Now,
                    Modified = DateTime.Now,
                    NumberOfPassengers = p.NumberOfPassengers,
                    PickupASAP = p.PickupASAP,
                    PickupTime = r.RouteDate,
                    RouteId = r.RouteId,
                    CustomerId = p.CustomerId
                };
                NP.PickupAddresses = new List<PickupAddress>();

                //Create new address
                foreach (var a in p.PickupAddresses)
                {
                    var pa = new PickupAddress()
                    {
                        Added = DateTime.Now,
                        Modified = DateTime.Now,
                        Address1 = a.Address1,
                        Address2 = a.Address2,
                        City = a.City,
                        Sequence = a.Sequence,
                        State = a.State,
                        ZipCode = a.ZipCode,
                        GeoLat = a.GeoLat,
                        GeoLong = a.GeoLong
                    };

                    NP.PickupAddresses.Add(pa);
                }

                db.Pickups.Add(NP);
                await db.SaveChangesAsync();

                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }

        [HttpDelete("[action]/{pickupId}")]
        public async Task<IActionResult> ConfirmCustomerPickup(int pickupId)
        {
            if (pickupId == 0)
            {
                return BadRequest("Error: Id cannot be 0");
            }

            try
            {
                var c = await db.Pickups.FindAsync(pickupId);
                if (c == null)
                {
                    return NotFound();
                }
                c.IsConfirmed = true;
                c.Confirmed = DateTime.Now;
                await db.SaveChangesAsync();
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }
    }
}