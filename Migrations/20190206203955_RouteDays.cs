using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace pathfinderRoute.Migrations
{
    public partial class RouteDays : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    SMSEnabled = table.Column<bool>(nullable: false),
                    Notes = table.Column<string>(nullable: true),
                    Added = table.Column<DateTime>(nullable: false),
                    AddedBy = table.Column<string>(nullable: true),
                    Modified = table.Column<DateTime>(nullable: false),
                    ModifiedBy = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Drivers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    Added = table.Column<DateTime>(nullable: false),
                    AddedBy = table.Column<string>(nullable: true),
                    Modified = table.Column<DateTime>(nullable: false),
                    ModifiedBy = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drivers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CustomerAddresses",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Address1 = table.Column<string>(nullable: true),
                    Address2 = table.Column<string>(nullable: true),
                    City = table.Column<string>(nullable: true),
                    State = table.Column<string>(nullable: true),
                    ZipCode = table.Column<string>(nullable: true),
                    GeoLat = table.Column<decimal>(type: "decimal(9, 6)", nullable: false),
                    GeoLong = table.Column<decimal>(type: "decimal(9, 6)", nullable: false),
                    Added = table.Column<DateTime>(nullable: false),
                    AddedBy = table.Column<string>(nullable: true),
                    Modified = table.Column<DateTime>(nullable: false),
                    ModifiedBy = table.Column<string>(nullable: true),
                    CustomerId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerAddresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerAddresses_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Vehicles",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Description = table.Column<string>(nullable: true),
                    Capacity = table.Column<int>(nullable: false),
                    DriverId = table.Column<int>(nullable: true),
                    Added = table.Column<DateTime>(nullable: false),
                    AddedBy = table.Column<string>(nullable: true),
                    Modified = table.Column<DateTime>(nullable: false),
                    ModifiedBy = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vehicles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vehicles_Drivers_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Drivers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Routes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RouteName = table.Column<string>(nullable: true),
                    RouteDescription = table.Column<string>(nullable: true),
                    ScheduledDeparture = table.Column<DateTime>(nullable: false),
                    RouteStarts = table.Column<DateTime>(nullable: false),
                    RouteExpires = table.Column<DateTime>(nullable: true),
                    BasePrice = table.Column<decimal>(nullable: false),
                    FromAddress = table.Column<string>(nullable: true),
                    FromGeoLat = table.Column<decimal>(type: "decimal(9, 6)", nullable: false),
                    FromGeoLong = table.Column<decimal>(type: "decimal(9, 6)", nullable: false),
                    ToAddress = table.Column<string>(nullable: true),
                    ToGeoLat = table.Column<decimal>(type: "decimal(9, 6)", nullable: false),
                    ToGeoLong = table.Column<decimal>(type: "decimal(9, 6)", nullable: false),
                    RouteDayMon = table.Column<bool>(nullable: false),
                    RouteDayTue = table.Column<bool>(nullable: false),
                    RouteDayWed = table.Column<bool>(nullable: false),
                    RouteDayThu = table.Column<bool>(nullable: false),
                    RouteDayFri = table.Column<bool>(nullable: false),
                    RouteDaySat = table.Column<bool>(nullable: false),
                    RouteDaySun = table.Column<bool>(nullable: false),
                    Added = table.Column<DateTime>(nullable: false),
                    AddedBy = table.Column<string>(nullable: true),
                    Modified = table.Column<DateTime>(nullable: false),
                    ModifiedBy = table.Column<string>(nullable: true),
                    VehicleId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Routes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Routes_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Pickups",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PickupTime = table.Column<DateTime>(nullable: true),
                    PickupASAP = table.Column<bool>(nullable: false),
                    NumberOfPassengers = table.Column<int>(nullable: false),
                    Notes = table.Column<string>(nullable: true),
                    Added = table.Column<DateTime>(nullable: false),
                    AddedBy = table.Column<string>(nullable: true),
                    Modified = table.Column<DateTime>(nullable: false),
                    ModifiedBy = table.Column<string>(nullable: true),
                    IsCancelled = table.Column<bool>(nullable: false),
                    Cancelled = table.Column<DateTime>(nullable: true),
                    CancelledBy = table.Column<string>(nullable: true),
                    IsConfirmed = table.Column<bool>(nullable: false),
                    Confirmed = table.Column<DateTime>(nullable: true),
                    ConfirmedBy = table.Column<string>(nullable: true),
                    IsMoved = table.Column<bool>(nullable: false),
                    Moved = table.Column<DateTime>(nullable: true),
                    MovedBy = table.Column<string>(nullable: true),
                    RouteId = table.Column<int>(nullable: true),
                    VehicleId = table.Column<int>(nullable: true),
                    CustomerId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pickups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pickups_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Pickups_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Pickups_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RouteDays",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RouteDate = table.Column<DateTime>(nullable: false),
                    RouteId = table.Column<int>(nullable: false),
                    DriverId = table.Column<int>(nullable: false),
                    VehicleId = table.Column<int>(nullable: false),
                    IsCancelled = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RouteDays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RouteDays_Drivers_DriverId",
                        column: x => x.DriverId,
                        principalTable: "Drivers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RouteDays_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RouteDays_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PickupAddresses",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Sequence = table.Column<int>(nullable: false),
                    Address1 = table.Column<string>(nullable: true),
                    Address2 = table.Column<string>(nullable: true),
                    City = table.Column<string>(nullable: true),
                    State = table.Column<string>(nullable: true),
                    ZipCode = table.Column<string>(nullable: true),
                    GeoLat = table.Column<decimal>(type: "decimal(9, 6)", nullable: false),
                    GeoLong = table.Column<decimal>(type: "decimal(9, 6)", nullable: false),
                    Added = table.Column<DateTime>(nullable: false),
                    AddedBy = table.Column<string>(nullable: true),
                    Modified = table.Column<DateTime>(nullable: false),
                    ModifiedBy = table.Column<string>(nullable: true),
                    PickupId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PickupAddresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PickupAddresses_Pickups_PickupId",
                        column: x => x.PickupId,
                        principalTable: "Pickups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerAddresses_CustomerId",
                table: "CustomerAddresses",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_PickupAddresses_PickupId",
                table: "PickupAddresses",
                column: "PickupId");

            migrationBuilder.CreateIndex(
                name: "IX_Pickups_CustomerId",
                table: "Pickups",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Pickups_RouteId",
                table: "Pickups",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_Pickups_VehicleId",
                table: "Pickups",
                column: "VehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_RouteDays_DriverId",
                table: "RouteDays",
                column: "DriverId");

            migrationBuilder.CreateIndex(
                name: "IX_RouteDays_RouteId",
                table: "RouteDays",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_RouteDays_VehicleId",
                table: "RouteDays",
                column: "VehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_Routes_VehicleId",
                table: "Routes",
                column: "VehicleId",
                unique: true,
                filter: "[VehicleId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_DriverId",
                table: "Vehicles",
                column: "DriverId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "CustomerAddresses");

            migrationBuilder.DropTable(
                name: "PickupAddresses");

            migrationBuilder.DropTable(
                name: "RouteDays");

            migrationBuilder.DropTable(
                name: "Pickups");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropTable(
                name: "Routes");

            migrationBuilder.DropTable(
                name: "Vehicles");

            migrationBuilder.DropTable(
                name: "Drivers");
        }
    }
}
