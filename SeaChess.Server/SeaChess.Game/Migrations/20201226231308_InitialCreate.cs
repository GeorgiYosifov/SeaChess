using Microsoft.EntityFrameworkCore.Migrations;

namespace SeaChess.Game.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Players",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Email = table.Column<string>(nullable: true),
                    Score = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Playgrounds",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    FirstPlayerId = table.Column<string>(nullable: true),
                    SecondPlayerId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Playgrounds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Playgrounds_Players_FirstPlayerId",
                        column: x => x.FirstPlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Playgrounds_Players_SecondPlayerId",
                        column: x => x.SecondPlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Playgrounds_FirstPlayerId",
                table: "Playgrounds",
                column: "FirstPlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_Playgrounds_SecondPlayerId",
                table: "Playgrounds",
                column: "SecondPlayerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Playgrounds");

            migrationBuilder.DropTable(
                name: "Players");
        }
    }
}
