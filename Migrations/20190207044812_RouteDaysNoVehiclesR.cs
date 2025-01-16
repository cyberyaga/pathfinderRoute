using Microsoft.EntityFrameworkCore.Migrations;

namespace pathfinderRoute.Migrations
{
    public partial class RouteDaysNoVehiclesR : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vehicles_Routes_RouteId",
                table: "Vehicles");

            migrationBuilder.DropIndex(
                name: "IX_Vehicles_RouteId",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "RouteId",
                table: "Vehicles");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RouteId",
                table: "Vehicles",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_RouteId",
                table: "Vehicles",
                column: "RouteId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicles_Routes_RouteId",
                table: "Vehicles",
                column: "RouteId",
                principalTable: "Routes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
