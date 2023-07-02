using System.ComponentModel.DataAnnotations;

namespace BirthdayWebApi.Classes
{
    public class Profile
    {
        [Key]
        public int Id { get; set; }
        public string? Login { get; set; }
        public string? Password { get; set; }
        public DateTime? Birth { get; set; }
        public bool? IsPublic { get; set; }

        public ICollection<Friend>? Friends { get; set; }
    }
}
