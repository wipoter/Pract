using BirthdayWebApi.Classes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace BirthdayWebApi.Controllers;

public class FriendController : Controller
{
    private readonly DataContext _context;

    public FriendController(DataContext context)
    {
        context.Profiles.Include("Friends").Load();
        _context = context;
    }

    #region Post

    [HttpPost("CreateFriend")]
    public async Task<IActionResult> CreateFriend([FromBody] Friend friend)
    {
        try
        {

            Friend friendToAdd = new()
            {
                Name = friend.Name,
                Surname = friend.Surname,
                Birth = friend.Birth
            };

            var profile = await _context.Profiles.FindAsync(friend.Id);
            
            if(profile != null)
            {
                profile.Friends.Add(friendToAdd);
                await _context.SaveChangesAsync();
                return Ok(new { Status = true });
            }
            return Ok(new { Status = false });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    #endregion

    #region Get

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAllFriends()
    {
        try
        {
            return Ok(await _context.Friends.ToListAsync());
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("getForId/{id:int}")]
    public async Task<IActionResult> GetFriendOfProfile(int id)
    {
        try
        {
            var profile = await _context.Profiles.FindAsync(id);
            if (profile?.Friends != null)
            {
                var listOfBirthdays = profile?.Friends.ToList();
                if (listOfBirthdays != null)
                    return Ok(listOfBirthdays);
            }

            return NotFound($"List of birthdays in profile with id {id} is empty.");
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("getForLogin")]
    public async Task<IActionResult> GetFriendOfProfileLogin(string login)
    {
        try
        {
            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.Login == login);
            if (profile?.Friends != null && profile?.IsPublic == true)
            {
                var listOfBirthdays = profile.Friends.ToList();
                if (listOfBirthdays != null)
                {
                    return Ok(listOfBirthdays.Select(f => new
                    {
                        name = f.Name,
                        surname = f.Surname,
                        birth = new DateOnly(f.Birth.Value.Year, f.Birth.Value.Month, f.Birth.Value.Day),
                        remains = DaysToBirth((DateTime)f.Birth)
                    }).ToList().OrderBy(f => f.remains).ToList());
                }
            }

            return Ok(new List<Friend>());
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpGet("getForLoginSelf")]
    public async Task<IActionResult> GetFriendOfProfileLoginSelf(string login)
    {
        try
        {
            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.Login == login);
            if (profile?.Friends != null)
            {
                var listOfBirthdays = profile?.Friends.ToList();
                var me = new Friend()
                {
                    Name = "Me",
                    Surname = "",
                    Birth = profile.Birth.Value
                };
                listOfBirthdays.Add(me);
                if (listOfBirthdays != null)
                {
                    return Ok(listOfBirthdays.Select(f => new
                    {
                        id = f.Id,
                        name = f.Name,
                        surname = f.Surname,
                        birth = new DateOnly(f.Birth.Value.Year, f.Birth.Value.Month, f.Birth.Value.Day),
                        remains = DaysToBirth((DateTime)f.Birth)
                    }).ToList().OrderBy(f => f.remains).ToList());
                }
            }

            return Ok(new List<Friend>());
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    #endregion

    #region Delete

    [HttpDelete("DeleteId/{id:int}")]
    public async Task<IActionResult> DeleteFriend(int id)
    {
        try
        {
            var birthday = await _context.Friends.FindAsync(id);
            if (birthday != null)
            {
                _context.Friends.Remove(birthday);
                await _context.SaveChangesAsync();
                return Ok(new { Status = true });
            }
            return Ok(new { Status = false });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    #endregion
    
    
    #region Update
    
    [HttpPut("UpdateFriend")]
    public async Task<IActionResult> UpdateFriend([FromBody] Friend friend)
    {
        try
        {
            var friendFromDB = await _context.Friends.FindAsync(friend.Id);
            if (friendFromDB != null)
            {
                friendFromDB.Name = friend.Name;
                friendFromDB.Surname = friend.Surname;
                friendFromDB.Birth = friend.Birth;
                await _context.SaveChangesAsync();
                return Ok(new { Status = true });
            }
            return Ok(new { Status = false });
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    #endregion


    private int DaysToBirth(DateTime date)
    {   
        DateTime birth = new DateTime(DateTime.Now.Year, date.Month, date.Day);
      
        if(birth >= DateTime.Now)
            return (birth.Subtract(new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day))).Days;
        return (DateTime.Now.Subtract(new DateTime(DateTime.Now.Year+1, date.Month, date.Day))).Days * -1;
    }
}