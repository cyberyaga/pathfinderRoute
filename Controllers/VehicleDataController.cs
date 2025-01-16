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
    public class VehicleDataController : Controller
    {
        private readonly ApplicationDbContext db;
        public VehicleDataController(ApplicationDbContext context)
        {
            db = context;
        }

        [HttpGet("[action]")]
        public async Task<List<VehicleView>> GetVehicles()
        {
            List<VehicleView> vvs = new List<VehicleView>();

            var tmp = from v in db.Vehicles.Include(x => x.Driver)//.Include(r => r.Route)
                      select v;

            await tmp.ForEachAsync(v =>
            {
                var vv = new VehicleView();
                vv.ConvertFromVehicle(v);
                vvs.Add(vv);
            });

            return vvs;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> AddVehicle([FromBody] Vehicle v)
        {
            try
            {
                v.Added = DateTime.Now;
                v.Modified = DateTime.Now;
                db.Vehicles.Add(v);
                if (await db.SaveChangesAsync() > 0)
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
        public async Task<IActionResult> UpdateVehicle([FromBody] Vehicle v)
        {
            try
            {

                var u = db.Vehicles.Find(v.Id);
                if (u != null)
                {
                    u.Description = v.Description;
                    u.Capacity = v.Capacity;

                    //DateStamp
                    u.Modified = DateTime.Now;

                    if (await db.SaveChangesAsync() > 0)
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