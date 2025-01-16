using Microsoft.EntityFrameworkCore.Migrations;

namespace pathfinderRoute.Migrations
{
    public partial class PricingIsFrom : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "PricingBoundaryEnabled",
                table: "Routes",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsFrom",
                table: "RoutePricings",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsTo",
                table: "RoutePricings",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PricingBoundaryEnabled",
                table: "Routes");

            migrationBuilder.DropColumn(
                name: "IsFrom",
                table: "RoutePricings");

            migrationBuilder.DropColumn(
                name: "IsTo",
                table: "RoutePricings");
        }
    }
}
