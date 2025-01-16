using Microsoft.EntityFrameworkCore.Migrations;

namespace pathfinderRoute.Migrations
{
    public partial class pickupprice : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoutePricings_Boundaries_boundaryId",
                table: "RoutePricings");

            migrationBuilder.AlterColumn<int>(
                name: "boundaryId",
                table: "RoutePricings",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CalculatedPrice",
                table: "Pickups",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Pickups",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddForeignKey(
                name: "FK_RoutePricings_Boundaries_boundaryId",
                table: "RoutePricings",
                column: "boundaryId",
                principalTable: "Boundaries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RoutePricings_Boundaries_boundaryId",
                table: "RoutePricings");

            migrationBuilder.DropColumn(
                name: "CalculatedPrice",
                table: "Pickups");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Pickups");

            migrationBuilder.AlterColumn<int>(
                name: "boundaryId",
                table: "RoutePricings",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_RoutePricings_Boundaries_boundaryId",
                table: "RoutePricings",
                column: "boundaryId",
                principalTable: "Boundaries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
