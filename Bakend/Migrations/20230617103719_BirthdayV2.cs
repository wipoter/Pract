using Microsoft.EntityFrameworkCore.Migrations;
using BCrypt;

#nullable disable

namespace BirthdayWebApi.Migrations
{
    /// <inheritdoc />
    public partial class BirthdayV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Profiles");

            migrationBuilder.RenameColumn(
                name: "Surname",
                table: "Profiles",
                newName: "Nickname");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Nickname",
                table: "Profiles",
                newName: "Surname");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Profiles",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
