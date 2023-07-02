using System.ComponentModel.DataAnnotations;

namespace BirthdayWebApi.Classes
{
    public class Friend
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public DateTime? Birth { get; set; }
    }
}
