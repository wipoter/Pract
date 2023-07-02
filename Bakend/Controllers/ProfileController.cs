using BirthdayWebApi.Classes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.Net;
using Microsoft.AspNetCore.Mvc.Razor.Infrastructure;

namespace BirthdayWebApi.Controllers
{
    public class ProfileController : Controller
    {
        private readonly DataContext _context;

        public ProfileController(DataContext context)
        {
            context.Profiles.Load();
            _context = context;
        }

        #region Create

        [HttpPost("CreateProfile")]
        public async Task<IActionResult> CreateProfile([FromBody] Profile profile)
        {
            if (CheckProfileForLogin(profile.Login))
            {
                try
                {
                    // Генерування хешу пароля
                    profile.Password = BCrypt.Net.BCrypt.HashPassword(profile.Password);
                    profile.Friends = new List<Friend>();
                    _context.Profiles.Add(profile);
                    await _context.SaveChangesAsync();
                    return Ok(new { Status = true });
                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }
            }
            else
                return Ok(new { Status = false });
        }

        #endregion

        #region Get

        [HttpGet("GetInfoAboutProfile")]
        public async Task<IActionResult> GetProfile(string login)
        {
            try
            {
                var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.Login == login);
                if (profile != null)
                {
                    return Ok(new { id = profile.Id, login = login, birth = new DateOnly(profile.Birth.Value.Year, profile.Birth.Value.Month, profile.Birth.Value.Day), isPublic = profile.IsPublic});
                }

                return Ok(new { });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("CheckProfile")]
        public async Task<IActionResult> GetProfileForLoginAndPassword(string login, string password)
        {
            try
            {
                var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.Login == login);
                if (profile != null)
                {
                    if (BCrypt.Net.BCrypt.Verify(password, profile.Password))
                        return Ok(new { Status = true });
                    return Ok(new { Status = false });
                }

                return Ok(new { Status = false });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("CheckPublicStatus")]
        public async Task<IActionResult> GetProfilePublicStatus(string login)
        {
            try
            {
                var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.Login == login);
                if (profile != null)
                {
                    if (profile.IsPublic == true)
                        return Ok(new { Status = true });
                    return Ok(new { Status = false });
                }
                return Ok(new { Status = false });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        private bool CheckProfileForLogin(string login)
        {
            var profile = _context.Profiles.FirstOrDefault(p => p.Login == login);
            if (profile == null)
                return true;
            return false;
        }

        #endregion

        #region Update

        [HttpPut("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile([FromBody] Profile profile)
        {
            try
            {
                var tmp = await _context.Profiles.FirstOrDefaultAsync(p => p.Login == profile.Login);
                if (tmp != null) {
                    if (BCrypt.Net.BCrypt.Verify(profile.Password, tmp.Password))
                    {
                        tmp.Birth = profile.Birth;
                        tmp.IsPublic = profile.IsPublic;
                        await _context.SaveChangesAsync();
                        return Ok(new { Status = true });
                    }
                    return Ok(new { Status = false });
                }

                return Ok(new { Status = false });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("UpdateProfilePassword")]
        public async Task<IActionResult> UpdateProfilePassword([FromBody] ProfilePasswordChange profilePasswordChange)
        {
            try
            {
                var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.Login == profilePasswordChange.Login);
                if (profile != null)
                {
                    if (BCrypt.Net.BCrypt.Verify(profilePasswordChange.Password, profile.Password))
                    {
                        profile.Password = BCrypt.Net.BCrypt.HashPassword(profilePasswordChange.PasswordNew);
                        await _context.SaveChangesAsync();
                        return Ok(new { Status = true });
                    }
                    return Ok(new { Status = false });
                }

                return Ok(new { Status = false });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        #endregion
    }
}
