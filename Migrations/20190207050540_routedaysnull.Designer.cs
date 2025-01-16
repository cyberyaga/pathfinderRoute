﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using pathfinderRoute.Models;

namespace pathfinderRoute.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20190207050540_routedaysnull")]
    partial class routedaysnull
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.1-servicing-10028")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("pathfinderRoute.Models.Company", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("Companies");
                });

            modelBuilder.Entity("pathfinderRoute.Models.Customer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Added");

                    b.Property<string>("AddedBy");

                    b.Property<string>("FirstName");

                    b.Property<string>("LastName");

                    b.Property<DateTime>("Modified");

                    b.Property<string>("ModifiedBy");

                    b.Property<string>("Notes");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("SMSEnabled");

                    b.HasKey("Id");

                    b.ToTable("Customers");
                });

            modelBuilder.Entity("pathfinderRoute.Models.CustomerAddress", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Added");

                    b.Property<string>("AddedBy");

                    b.Property<string>("Address1");

                    b.Property<string>("Address2");

                    b.Property<string>("City");

                    b.Property<int>("CustomerId");

                    b.Property<decimal>("GeoLat")
                        .HasColumnType("decimal(9, 6)");

                    b.Property<decimal>("GeoLong")
                        .HasColumnType("decimal(9, 6)");

                    b.Property<DateTime>("Modified");

                    b.Property<string>("ModifiedBy");

                    b.Property<string>("State");

                    b.Property<string>("ZipCode");

                    b.HasKey("Id");

                    b.HasIndex("CustomerId");

                    b.ToTable("CustomerAddresses");
                });

            modelBuilder.Entity("pathfinderRoute.Models.Driver", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Added");

                    b.Property<string>("AddedBy");

                    b.Property<string>("FirstName");

                    b.Property<string>("LastName");

                    b.Property<DateTime>("Modified");

                    b.Property<string>("ModifiedBy");

                    b.HasKey("Id");

                    b.ToTable("Drivers");
                });

            modelBuilder.Entity("pathfinderRoute.Models.Pickup", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Added");

                    b.Property<string>("AddedBy");

                    b.Property<DateTime?>("Cancelled");

                    b.Property<string>("CancelledBy");

                    b.Property<DateTime?>("Confirmed");

                    b.Property<string>("ConfirmedBy");

                    b.Property<int>("CustomerId");

                    b.Property<bool>("IsCancelled");

                    b.Property<bool>("IsConfirmed");

                    b.Property<bool>("IsMoved");

                    b.Property<DateTime>("Modified");

                    b.Property<string>("ModifiedBy");

                    b.Property<DateTime?>("Moved");

                    b.Property<string>("MovedBy");

                    b.Property<string>("Notes");

                    b.Property<int>("NumberOfPassengers");

                    b.Property<bool>("PickupASAP");

                    b.Property<DateTime?>("PickupTime");

                    b.Property<int?>("RouteId");

                    b.Property<int?>("VehicleId");

                    b.HasKey("Id");

                    b.HasIndex("CustomerId");

                    b.HasIndex("RouteId");

                    b.HasIndex("VehicleId");

                    b.ToTable("Pickups");
                });

            modelBuilder.Entity("pathfinderRoute.Models.PickupAddress", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Added");

                    b.Property<string>("AddedBy");

                    b.Property<string>("Address1");

                    b.Property<string>("Address2");

                    b.Property<string>("City");

                    b.Property<decimal>("GeoLat")
                        .HasColumnType("decimal(9, 6)");

                    b.Property<decimal>("GeoLong")
                        .HasColumnType("decimal(9, 6)");

                    b.Property<DateTime>("Modified");

                    b.Property<string>("ModifiedBy");

                    b.Property<int>("PickupId");

                    b.Property<int>("Sequence");

                    b.Property<string>("State");

                    b.Property<string>("ZipCode");

                    b.HasKey("Id");

                    b.HasIndex("PickupId");

                    b.ToTable("PickupAddresses");
                });

            modelBuilder.Entity("pathfinderRoute.Models.Route", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Added");

                    b.Property<string>("AddedBy");

                    b.Property<decimal>("BasePrice");

                    b.Property<string>("FromAddress");

                    b.Property<decimal>("FromGeoLat")
                        .HasColumnType("decimal(9, 6)");

                    b.Property<decimal>("FromGeoLong")
                        .HasColumnType("decimal(9, 6)");

                    b.Property<DateTime>("Modified");

                    b.Property<string>("ModifiedBy");

                    b.Property<bool>("RouteDayFri");

                    b.Property<bool>("RouteDayMon");

                    b.Property<bool>("RouteDaySat");

                    b.Property<bool>("RouteDaySun");

                    b.Property<bool>("RouteDayThu");

                    b.Property<bool>("RouteDayTue");

                    b.Property<bool>("RouteDayWed");

                    b.Property<string>("RouteDescription");

                    b.Property<DateTime?>("RouteExpires");

                    b.Property<string>("RouteName");

                    b.Property<DateTime>("RouteStarts");

                    b.Property<DateTime>("ScheduledDeparture");

                    b.Property<string>("ToAddress");

                    b.Property<decimal>("ToGeoLat")
                        .HasColumnType("decimal(9, 6)");

                    b.Property<decimal>("ToGeoLong")
                        .HasColumnType("decimal(9, 6)");

                    b.HasKey("Id");

                    b.ToTable("Routes");
                });

            modelBuilder.Entity("pathfinderRoute.Models.RouteDay", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("DriverId");

                    b.Property<bool>("IsCancelled");

                    b.Property<DateTime>("RouteDate");

                    b.Property<int>("RouteId");

                    b.Property<int?>("VehicleId");

                    b.HasKey("Id");

                    b.HasIndex("DriverId");

                    b.HasIndex("RouteId");

                    b.HasIndex("VehicleId");

                    b.ToTable("RouteDays");
                });

            modelBuilder.Entity("pathfinderRoute.Models.Vehicle", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Added");

                    b.Property<string>("AddedBy");

                    b.Property<int>("Capacity");

                    b.Property<string>("Description");

                    b.Property<int?>("DriverId");

                    b.Property<DateTime>("Modified");

                    b.Property<string>("ModifiedBy");

                    b.HasKey("Id");

                    b.HasIndex("DriverId");

                    b.ToTable("Vehicles");
                });

            modelBuilder.Entity("pathfinderRoute.Models.CustomerAddress", b =>
                {
                    b.HasOne("pathfinderRoute.Models.Customer", "Customer")
                        .WithMany("CustomerAddresses")
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("pathfinderRoute.Models.Pickup", b =>
                {
                    b.HasOne("pathfinderRoute.Models.Customer", "Customer")
                        .WithMany("Pickups")
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("pathfinderRoute.Models.Route", "Route")
                        .WithMany("Pickups")
                        .HasForeignKey("RouteId");

                    b.HasOne("pathfinderRoute.Models.Vehicle", "Vehicle")
                        .WithMany("Pickups")
                        .HasForeignKey("VehicleId");
                });

            modelBuilder.Entity("pathfinderRoute.Models.PickupAddress", b =>
                {
                    b.HasOne("pathfinderRoute.Models.Pickup", "Pickup")
                        .WithMany("PickupAddresses")
                        .HasForeignKey("PickupId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("pathfinderRoute.Models.RouteDay", b =>
                {
                    b.HasOne("pathfinderRoute.Models.Driver", "Driver")
                        .WithMany()
                        .HasForeignKey("DriverId");

                    b.HasOne("pathfinderRoute.Models.Route", "Route")
                        .WithMany("RouteDays")
                        .HasForeignKey("RouteId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("pathfinderRoute.Models.Vehicle", "Vehicle")
                        .WithMany()
                        .HasForeignKey("VehicleId");
                });

            modelBuilder.Entity("pathfinderRoute.Models.Vehicle", b =>
                {
                    b.HasOne("pathfinderRoute.Models.Driver", "Driver")
                        .WithMany()
                        .HasForeignKey("DriverId");
                });
#pragma warning restore 612, 618
        }
    }
}
