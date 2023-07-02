using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BirthdayWebApi.Migrations
{
    /// <inheritdoc />
    public partial class BirthdayV3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Loggin",
                table: "Profiles");

            migrationBuilder.RenameColumn(
                name: "Nickname",
                table: "Profiles",
                newName: "Login");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Login",
                table: "Profiles",
                newName: "Nickname");

            migrationBuilder.AddColumn<string>(
                name: "Loggin",
                table: "Profiles",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
