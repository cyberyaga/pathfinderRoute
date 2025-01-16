using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace pathfinderRoute.Migrations
{
    public partial class BoundariesCoordinates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Boundaries",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true),
                    Color = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Boundaries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BoundaryCoordinates",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    BoundaryId = table.Column<int>(nullable: false),
                    GeoLat = table.Column<decimal>(nullable: false),
                    GeoLong = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoundaryCoordinates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BoundaryCoordinates_Boundaries_BoundaryId",
                        column: x => x.BoundaryId,
                        principalTable: "Boundaries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BoundaryCoordinates_BoundaryId",
                table: "BoundaryCoordinates",
                column: "BoundaryId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BoundaryCoordinates");

            migrationBuilder.DropTable(
                name: "Boundaries");
        }
    }
}
