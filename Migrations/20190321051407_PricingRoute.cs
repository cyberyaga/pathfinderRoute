using Microsoft.EntityFrameworkCore.Migrations;

namespace pathfinderRoute.Migrations
{
    public partial class PricingRoute : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "routeId",
                table: "RoutePricings",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_RoutePricings_routeId",
                table: "RoutePricings",
                column: "routeId");

            migrationBuilder.AddForeignKey(
                name: "FK_RoutePricings_Routes_routeId",
                table: "RoutePricings",
                column: "routeId",
                principalTable: "Routes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoutePricings_Routes_routeId",
                table: "RoutePricings");

            migrationBuilder.DropIndex(
                name: "IX_RoutePricings_routeId",
                table: "RoutePricings");

            migrationBuilder.DropColumn(
                name: "routeId",
                table: "RoutePricings");
        }
    }
}
