using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Configuration;

namespace pathfinderRoute.Models
{
    public class ApplicationDbAuthContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbAuthContext()
        {
        }

        public ApplicationDbAuthContext(DbContextOptions<ApplicationDbAuthContext> options): base(options)
        {
        }

        // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        // {
        //     optionsBuilder.UseSqlServer("Server=localhost;Database=pathfinderRouteAuthDB;User Id=sa;Password=Flaco234;");
        // }
    }
}