using Microsoft.EntityFrameworkCore.Migrations;

namespace pathfinderRoute.Migrations
{
    public partial class driveruserid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Drivers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Drivers");
        }
    }
}
