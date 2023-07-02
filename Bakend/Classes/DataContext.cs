using Microsoft.EntityFrameworkCore;

namespace BirthdayWebApi.Classes
{
    public class DataContext:DbContext
    {
        public DataContext(DbContextOptions options)
            : base(options) { }

        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Friend> Friends { get; set; }
    }
}
