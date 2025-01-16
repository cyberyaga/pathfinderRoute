using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using pathfinderRoute.Models;
using pathfinderRoute.ModelsView;

namespace pathfinderRoute.Controllers
{
    [Route("api/[controller]")]
    // [Authorize]
    public class RouteDataController : Controller
    {

        private readonly ApplicationDbContext db;
        public RouteDataController(ApplicationDbContext context)
        {
            db = context;
        }

        [HttpGet("[action]")]
        public async Task<List<RouteView>> GetRoutes(DateTime? RouteDate, bool IncludeAll = false, int? AssignedDriverId = null)
        {
            var identity = (ClaimsIdentity)User.Identity;
            IEnumerable<Claim> claims = identity.Claims;

            DateTime rtDate = DateTime.Now.Date;
            int driverId = 0;

            if (RouteDate.HasValue)
            {
                rtDate = RouteDate.Value;
            }

            if (AssignedDriverId.HasValue){
                driverId = AssignedDriverId.Value;
            }

            List<RouteView> rs = new List<RouteView>();

            bool isSunday = rtDate.DayOfWeek == DayOfWeek.Sunday;
            bool isMonday = rtDate.DayOfWeek == DayOfWeek.Monday;
            bool isTuesday = rtDate.DayOfWeek == DayOfWeek.Tuesday;
            bool isWednesday = rtDate.DayOfWeek == DayOfWeek.Wednesday;
            bool isThursday = rtDate.DayOfWeek == DayOfWeek.Thursday;
            bool isFriday = rtDate.DayOfWeek == DayOfWeek.Friday;
            bool isSaturday = rtDate.DayOfWeek == DayOfWeek.Saturday;

            return await
                (from r in db.Routes.Include(p => p.RoutePricings).ThenInclude(b => b.boundary).ThenInclude(c => c.Coordinates).Include(p => p.Pickups)
                 join rd in db.RouteDays.Include(d => d.Driver).Include(v => v.Vehicle) on new { RouteId = r.Id, RouteDate = rtDate } equals new { rd.RouteId, RouteDate = rd.RouteDate.Date } into rde
                 from rd in rde.DefaultIfEmpty()
                 where
                 //Make sure is available for that day.                     
                 (((isSunday && r.RouteDaySun) ||
                 (isMonday && r.RouteDayMon) ||
                 (isTuesday && r.RouteDayTue) ||
                 (isWednesday && r.RouteDayWed) ||
                 (isThursday && r.RouteDayThu) ||
                 (isFriday && r.RouteDayFri) ||
                 (isSaturday && r.RouteDaySat))
                 //Bypass if IncludeAll
                 || IncludeAll)
                 //Check date
                 && (r.RouteStarts.Date <= RouteDate && (r.RouteExpires.HasValue ? r.RouteExpires.Value.Date >= RouteDate : true))
                 && (driverId == 0 ? true : r.RouteDays.Any(y => y.DriverId == driverId))
                 orderby r.ScheduledDeparture.TimeOfDay
                 select new RouteView(r, rtDate, rd)).ToListAsync();
        }

        [HttpGet("[action]")]
        public async Task<RouteView> GetRoute(int RouteId)
        {
            db.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            return await db.Routes
            .Include(p => p.RoutePricings).ThenInclude(b => b.boundary).ThenInclude(c => c.Coordinates)
            .Where(x => x.Id == RouteId)
            .Select(s => new RouteView(s, null, null)).SingleAsync();
        }

        [HttpGet("[action]")]
        public async Task<List<CustomerPickup>> GetRoutePickups(int RouteID, DateTime RouteDate)
        {
            return await (from p in db.Pickups.Include(x => x.Customer).Include(x => x.PickupAddresses)
                          where
                            p.RouteId == RouteID &&
                            p.PickupTime.Value.Date == RouteDate &&
                            !p.IsMoved
                          select new CustomerPickup(p)).ToListAsync();
        }

        [HttpGet("[action]")]
        public List<DateTime> GetRouteDatesWithPickups()
        {
            //TODO - Make sure that no more than x number is returned and filter by date as well.
            return db.Pickups.Where(x => !x.IsCancelled && !x.IsMoved).GroupBy(g => g.PickupTime.Value.Date).Select(s => s.Key).ToList();
        }

        [HttpGet("[action]")]
        public async Task<List<BoundaryView>> GetBoundaries(int RouteId, bool WithCoord = false)
        {
            var returnlist = new List<BoundaryView>();
            var results = new List<Boundary>();


            if (WithCoord)
            {
                results = await (from b in db.Boundaries.Include(x => x.Coordinates)
                                 where RouteId == 0 ? true : b.Id == RouteId
                                 select b).ToListAsync();
            }
            else
            {
                results = await (from b in db.Boundaries
                                 where RouteId == 0 ? true : b.Id == RouteId
                                 select b).ToListAsync();
            }

            results.ForEach(x =>
            {
                var b = new BoundaryView();
                b.ConvertFromBoundary(x);
                returnlist.Add(b);
            });

            return returnlist;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateBoundary([FromBody] BoundaryView b)
        {
            if (ModelState.IsValid)
            {
                Boundary bound = new Boundary();

                //If existing update
                if (b.Id > 0)
                {
                    try
                    {
                        bound = await db.Boundaries.Include(i => i.Coordinates).SingleAsync(x => x.Id == b.Id);
                    }
                    catch (System.Exception)
                    {
                        return BadRequest("Unable to find boundary in database.");
                    }
                }
                else
                {
                    bound.Coordinates = new List<BoundaryCoordinate>();
                    db.Boundaries.Add(bound);
                }

                bound.Name = b.Name;
                bound.Color = b.Color;

                if (b.Coordinates != null && b.Coordinates.Count > 0)
                {
                    if (b.Id > 0)
                    {
                        bound.Coordinates.RemoveAll(x => x.Id > 0);
                    }


                    //Convert
                    b.Coordinates.ForEach(c =>
                    {
                        var nc = new BoundaryCoordinate()
                        {
                            GeoLat = c.GeoLat,
                            GeoLong = c.GeoLong,
                            CoordinateOrder = c.CoordinateOrder
                        };
                        bound.Coordinates.Add(nc);
                    });
                }

                try
                {
                    var result = await db.SaveChangesAsync();

                    if (result > 1)
                    {
                        return Ok();
                    }
                    else
                    {
                        return BadRequest("Unable to save boundary:");
                    }
                }
                catch (DbUpdateException dbex)
                {
                    return BadRequest("Unable to save boundary:" + dbex.Message);
                }
            }
            return BadRequest("Unable to validate boundary.");
        }


        [HttpPost("[action]")]
        public async Task<IActionResult> AddRoute([FromBody] Route r)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    //Convert UTC
                    DateTime convertedDate = DateTime.SpecifyKind(r.ScheduledDeparture, DateTimeKind.Utc);
                    r.ScheduledDeparture = convertedDate.ToLocalTime();

                    //Set Timestamp
                    r.Added = DateTime.Now;
                    r.Modified = DateTime.Now;

                    db.Add(r);
                    await db.SaveChangesAsync();
                    return Ok();
                }
                catch (System.Exception ex)
                {
                    return BadRequest("Unable to save Route values. Ex: " + ex.Message);
                }
            }

            return BadRequest("Unable to validate Route values");
        }

        [HttpPut("[action]")]
        public async Task<IActionResult> UpdateRoute([FromBody] Route r)
        {
            if (ModelState.IsValid && r.Id != 0)
            {
                try
                {
                    var route = await db.Routes.Include(rp => rp.RoutePricings).SingleAsync(x => x.Id == r.Id);

                    route.RouteName = r.RouteName;
                    route.RouteDescription = r.RouteDescription;
                    route.RouteStarts = r.RouteStarts;
                    route.RouteExpires = r.RouteExpires;
                    route.BasePrice = r.BasePrice;
                    route.FromAddress = r.FromAddress;
                    route.ToAddress = r.ToAddress;
                    route.RouteDayMon = r.RouteDayMon;
                    route.RouteDayTue = r.RouteDayTue;
                    route.RouteDayWed = r.RouteDayWed;
                    route.RouteDayThu = r.RouteDayThu;
                    route.RouteDayFri = r.RouteDayFri;
                    route.RouteDaySat = r.RouteDaySat;
                    route.RouteDaySun = r.RouteDaySun;
                    //route.VehicleId = r.VehicleId;

                    //Update Price Boundaries
                    if (!r.PricingBoundaryEnabled) //If not enabled, delete
                    {
                        route.RoutePricings.RemoveAll(d => d.route.Id == r.Id);
                    }
                    else
                    {
                        route.RoutePricings.RemoveAll(d => d.route.Id == r.Id);
                        route.RoutePricings.AddRange(r.RoutePricings);
                    }
                    route.PricingBoundaryEnabled = r.PricingBoundaryEnabled;


                    //Convert UTC
                    DateTime convertedDate = DateTime.SpecifyKind(r.ScheduledDeparture, DateTimeKind.Utc);
                    route.ScheduledDeparture = convertedDate.ToLocalTime();

                    //Set Timestamp
                    route.Modified = DateTime.Now;

                    await db.SaveChangesAsync();
                    return Ok();
                }
                catch (System.Exception ex)
                {
                    return BadRequest("Unable to save Route values. Ex: " + ex.Message);
                }
            }

            return BadRequest("Unable to validate Route values");
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> MoveRoutePickup(int PickupId, int RouteId, DateTime RouteDate)
        {
            //Get Pickup
            Pickup p = await db.Pickups.FindAsync(PickupId);
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
                PickupTime = RouteDate,
                RouteId = RouteId,
                CustomerId = p.CustomerId
            };

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

            await db.SaveChangesAsync();

            return Ok();

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateRouteDay([FromBody] RouteDayView r)
        {
            if (r != null)
            {
                try
                {
                    //Find a record
                    var rd = await db.RouteDays.FirstOrDefaultAsync(x => x.RouteId == r.RouteId && x.RouteDate.Date == r.RouteDate.Date);

                    if (rd == null) //If not found create new
                    {
                        rd = new RouteDay();
                        rd.RouteId = r.RouteId;
                        rd.RouteDate = r.RouteDate;
                    }

                    //Map values
                    rd.DriverId = (r.DriverId != 0) ? r.DriverId : null;
                    rd.VehicleId = (r.VehicleId != 0) ? r.VehicleId : null;

                    // if (r.IsCancelled)
                    // {
                    //     rd.Cancelled = DateTime.Now;
                    //     rd.CancelledBy = "";
                    // }
                    rd.IsCancelled = r.IsCancelled;

                    try
                    {
                        if (rd.Id == 0) //If new record, add it.
                        {
                            db.RouteDays.Add(rd);
                        }


                        var result = await db.SaveChangesAsync();

                        if (result > 0)
                        {
                            return Ok();
                        }
                        else
                        {
                            return BadRequest("Error saving data. No record updated.");
                        }
                    }
                    catch (System.Exception ex)
                    {
                        return BadRequest("Error Submitting data: " + ex.Message);
                    }
                }
                catch (System.Exception ex)
                {
                    return BadRequest("Error: " + ex.Message);
                }
            }
            else
            {
                return BadRequest("No RouteDay object provided.");
            }
        }
    }
}