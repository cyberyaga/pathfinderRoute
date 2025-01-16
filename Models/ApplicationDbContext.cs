using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Configuration;

namespace pathfinderRoute.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<CustomerAddress> CustomerAddresses { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Pickup> Pickups { get; set; }
        public DbSet<PickupAddress> PickupAddresses { get; set; }
        public DbSet<Route> Routes { get; set; }
        public DbSet<RouteDay> RouteDays { get; set; }
        public DbSet<RoutePricing> RoutePricings { get; set; }
        public DbSet<Boundary> Boundaries { get; set; }
        public DbSet<BoundaryCoordinate> BoundaryCoordinates { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Company> Companies { get; set; }


        // protected override void OnModelCreating(ModelBuilder modelBuilder)
        // {
        //     base.OnModelCreating(modelBuilder);
        //     modelBuilder.Entity<Product>()
        //         .Property(p => p.Price)
        //         .HasColumnType("decimal(18,2)");
        // }
        // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        // {
        //     //optionsBuilder.UseSqlServer("Server=localhost;Database=pathfinderRouteDB;User Id=sa;Password=Flaco234;");
        //     optionsBuilder.UseSqlServer(ConfigurationManager.ConnectionStrings["BloggingDatabase"].ConnectionString);
        // }
    }
}