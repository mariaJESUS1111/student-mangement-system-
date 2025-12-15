using Microsoft.AspNetCore.Mvc;

namespace StudentApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest req)
        {
            // Very simple example — replace with real user validation
            if (req.Username == "admin" && req.Password == "1234")
            {
                return Ok(new
                {
                    token = "dummy-jwt-token",
                    user = new { first = "Admin", last = "User" }
                });
            }

            return Unauthorized(new { message = "Invalid username or password" });
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
