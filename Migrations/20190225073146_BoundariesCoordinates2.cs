using Microsoft.EntityFrameworkCore.Migrations;

namespace pathfinderRoute.Migrations
{
    public partial class BoundariesCoordinates2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "GeoLong",
                table: "BoundaryCoordinates",
                type: "decimal(9,6)",
                nullable: false,
                oldClrType: typeof(decimal));

            migrationBuilder.AlterColumn<decimal>(
                name: "GeoLat",
                table: "BoundaryCoordinates",
                type: "decimal(9,6)",
                nullable: false,
                oldClrType: typeof(decimal));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "GeoLong",
                table: "BoundaryCoordinates",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(9,6)");

            migrationBuilder.AlterColumn<decimal>(
                name: "GeoLat",
                table: "BoundaryCoordinates",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(9,6)");
        }
    }
}
