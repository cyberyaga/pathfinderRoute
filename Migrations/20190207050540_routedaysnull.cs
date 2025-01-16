using Microsoft.EntityFrameworkCore.Migrations;

namespace pathfinderRoute.Migrations
{
    public partial class routedaysnull : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RouteDays_Drivers_DriverId",
                table: "RouteDays");

            migrationBuilder.DropForeignKey(
                name: "FK_RouteDays_Vehicles_VehicleId",
                table: "RouteDays");

            migrationBuilder.AlterColumn<int>(
                name: "VehicleId",
                table: "RouteDays",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "DriverId",
                table: "RouteDays",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_RouteDays_Drivers_DriverId",
                table: "RouteDays",
                column: "DriverId",
                principalTable: "Drivers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RouteDays_Vehicles_VehicleId",
                table: "RouteDays",
                column: "VehicleId",
                principalTable: "Vehicles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RouteDays_Drivers_DriverId",
                table: "RouteDays");

            migrationBuilder.DropForeignKey(
                name: "FK_RouteDays_Vehicles_VehicleId",
                table: "RouteDays");

            migrationBuilder.AlterColumn<int>(
                name: "VehicleId",
                table: "RouteDays",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DriverId",
                table: "RouteDays",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_RouteDays_Drivers_DriverId",
                table: "RouteDays",
                column: "DriverId",
                principalTable: "Drivers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RouteDays_Vehicles_VehicleId",
                table: "RouteDays",
                column: "VehicleId",
                principalTable: "Vehicles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
