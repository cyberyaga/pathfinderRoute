using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using pathfinderRoute.Models;
using pathfinderRoute.ModelViews;
using System.Linq;
using pathfinderRoute.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System;
using pathfinderRoute.ModelsView;
using Microsoft.Extensions.Configuration;

namespace pathfinderRoute.Controllers
{
    [Route("api/[controller]")]
    public class AccountsController : Controller
    {
        private readonly ApplicationDbContext db;
        private readonly ApplicationDbAuthContext dba;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IEmailService emailService;
        private readonly IConfiguration configuration;


        public AccountsController(
            ApplicationDbContext dbcontext, 
            ApplicationDbAuthContext dbacontext, 
            UserManager<ApplicationUser> _userManager, 
            IEmailService _emailService,
            IConfiguration _configuration)
        {
            db = dbcontext;
            dba = dbacontext;
            userManager = _userManager;
            emailService = _emailService;
            configuration = _configuration;
        }

        [HttpGet("[action]")]
        public async Task<List<UserView>> GetUsers()
        {
            var users = userManager.Users;

            List<UserView> usersResult = new List<UserView>();
            foreach (var user in users)
            {
                //Get Claims
                var uc = await userManager.GetClaimsAsync(user);

                var ur = await userManager.GetRolesAsync(user);

                var u = new UserView();
                u.Id = user.Id;
                u.UserName = user.UserName;
                u.Email = uc.FirstOrDefault(c => c.Type == "email") != null ? uc.FirstOrDefault(c => c.Type == "email").Value : "";
                u.FirstName = uc.FirstOrDefault(c => c.Type == "given_name") != null ? uc.FirstOrDefault(c => c.Type == "given_name").Value : "";
                u.LastName = uc.FirstOrDefault(c => c.Type == "family_name") != null ? uc.FirstOrDefault(c => c.Type == "family_name").Value : "";
                u.CompanyId = user.CompanyId;
                u.Roles = string.Join(',', ur.ToArray());

                usersResult.Add(u);
            }

            //Return
            return usersResult;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> SendPasswordReset(string userId)
        {
            if (!string.IsNullOrWhiteSpace(userId))
            {
                var curUser = await userManager.FindByIdAsync(userId);

                if (curUser != null)
                {
                    var msg = await SendPasswordResetMail(curUser);
                    if (string.IsNullOrWhiteSpace(msg))
                    {
                        return Ok();
                    }
                    else
                    {
                        return BadRequest(msg);
                    }
                }
                else
                {
                    return BadRequest("Unable to find user provided");
                }
            }
            else
            {
                return BadRequest("No user information provided");
            }
        }

        private async Task<string> SendPasswordResetMail(ApplicationUser curUser)
        {
            var token = await userManager.GeneratePasswordResetTokenAsync(curUser);

            var resetLink = configuration.GetSection("PasswordResetURL").Value + "?token=" + System.Net.WebUtility.UrlEncode(token) + "&I=" + curUser.Id;

            try
            {
                var msg = new EmailMessage();
                msg.FromAddresses.Add(new EmailAddress() { Address = "accounts@pathfinderRoute.com" });
                msg.ToAddresses.Add(new EmailAddress() { Address = curUser.Email });
                msg.Subject = "Account Password Reset";
                msg.Content = "<p>Here is the link to reset your account's password for pathfinderRoute.<br/><br/><br/>Reset Link: <a href=\"" + resetLink + "\">Click Here to reset your password</a>";
                emailService.Send(msg);
                return "";
            }
            catch (System.Exception e)
            {
                return "Error Sending Email: " + e.Message;
            }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordViewModel obj)
        {
            var user = await userManager.FindByIdAsync(obj.UserId);

            IdentityResult result = await userManager.ResetPasswordAsync(user, obj.Token, obj.Password);
            if (result.Succeeded)
            {
                return Ok();
            }
            else
            {
                string errors = "<ul>";
                foreach (var err in result.Errors)
                {
                    errors += "<li>" + err.Description + "</li>";                                                            
                }
                errors += "</ul>";

                return BadRequest("Error while resetting the password:" + errors); 
            }
        }
        [HttpPost("[action]")]
        public async Task<IActionResult> CreateUser([FromBody] UserView u)
        {
            //If good...
            if (ModelState.IsValid)
            {
                //Already created
                var repemail = await userManager.FindByEmailAsync(u.Email);
                var repuname = await userManager.FindByNameAsync(u.UserName);

                if (repemail != null)
                {
                    return BadRequest("Error: User found with that email address");
                }

                if (repuname != null)
                {
                    return BadRequest("Error: Username already taken.");
                }

                var user = new ApplicationUser { UserName = u.UserName };
                var result = await userManager.CreateAsync(user);

                if (result.Succeeded)
                {
                    //Create Claims
                    await userManager.AddClaimAsync(user, new Claim("name", u.FirstName + " " + u.LastName));
                    await userManager.AddClaimAsync(user, new Claim("given_name", u.FirstName));
                    await userManager.AddClaimAsync(user, new Claim("family_name", u.LastName));
                    await userManager.AddClaimAsync(user, new Claim("email", u.Email));

                    //Create Roles
                    var uRoles = await userManager.GetRolesAsync(user);
                    await userManager.RemoveFromRolesAsync(user, uRoles);

                    foreach (var r in u.Roles.Split(','))
                    {
                        await userManager.AddToRoleAsync(user, r);
                    }

                    await userManager.UpdateAsync(user);

                    //Check Driver status
                    var Driver = db.Drivers.SingleOrDefault(d => d.UserId == user.Id);
                    bool isAssigned = u.Roles.Split(',').Contains("driver");

                    //Remove Driver
                    if (Driver != null && !isAssigned)
                    {
                        db.Drivers.Remove(Driver);
                        await db.SaveChangesAsync();
                    }

                    //Add Driver
                    if (Driver == null && isAssigned)
                    {
                        var d = new Driver();
                        d.FirstName = u.FirstName;
                        d.LastName = u.LastName;
                        d.UserId = user.Id;
                        d.Added = DateTime.Now;
                        d.Modified = DateTime.Now;
                        db.Drivers.Add(d);
                        await db.SaveChangesAsync();
                    }

                    //Send email
                    var msg = await SendPasswordResetMail(user);
                    if (string.IsNullOrWhiteSpace(msg))
                    {
                        return Ok();
                    }
                    else
                    {
                        return BadRequest(msg);
                    }
                }
                else
                {
                    return BadRequest("Error Creating user");
                }
            }
            return Ok();
        }

        [HttpPut("[action]")]
        public async Task<UserView> UpdateUser([FromBody] UserView u)
        {

            var curUser = await userManager.FindByIdAsync(u.Id);

            //if account was created, then assign roles
            if (curUser != null)
            {
                curUser.UserName = u.UserName;
                curUser.Email = u.Email; //TODO: need to verify new email if different

                //Get Claims
                var uClaims = await userManager.GetClaimsAsync(curUser);

                if (uClaims.Count == 0)
                {
                    //Create Claims
                    await userManager.AddClaimAsync(curUser, new Claim("name", u.FirstName + " " + u.LastName));
                    await userManager.AddClaimAsync(curUser, new Claim("given_name", u.FirstName));
                    await userManager.AddClaimAsync(curUser, new Claim("family_name", u.LastName));
                    await userManager.AddClaimAsync(curUser, new Claim("email", u.Email));
                }
                else
                {
                    //Update Claims
                    foreach (var c in uClaims)
                    {
                        switch (c.Type)
                        {
                            case "name":
                                {
                                    if (c.Value == u.FirstName + " " + u.LastName)
                                        continue;
                                    await userManager.RemoveClaimAsync(curUser, c);
                                    await userManager.AddClaimAsync(curUser, new Claim(c.Type, u.FirstName + " " + u.LastName));
                                    break;
                                }
                            case "given_name":
                                {
                                    if (c.Value == u.FirstName)
                                        continue;
                                    await userManager.RemoveClaimAsync(curUser, c);
                                    await userManager.AddClaimAsync(curUser, new Claim(c.Type, u.FirstName));
                                    break;
                                }
                            case "family_name":
                                {
                                    if (c.Value == u.LastName)
                                        continue;
                                    await userManager.RemoveClaimAsync(curUser, c);
                                    await userManager.AddClaimAsync(curUser, new Claim(c.Type, u.LastName));
                                    break;
                                }
                            case "email":
                                {
                                    if (c.Value == u.Email)
                                        continue;
                                    await userManager.RemoveClaimAsync(curUser, c);
                                    await userManager.AddClaimAsync(curUser, new Claim(c.Type, u.Email));
                                    break;
                                }
                            case "email_verified":
                                {
                                    break;
                                }
                        }
                    }
                }

                //Update Roles
                var uRoles = await userManager.GetRolesAsync(curUser);
                await userManager.RemoveFromRolesAsync(curUser, uRoles);

                foreach (var r in u.Roles.Split(','))
                {
                    await userManager.AddToRoleAsync(curUser, r);
                }

                await userManager.UpdateAsync(curUser);

                //Check Driver status
                var Driver = db.Drivers.SingleOrDefault(d => d.UserId == curUser.Id);
                bool isAssigned = u.Roles.Split(',').Contains("Driver");

                //Remove Driver
                if (Driver != null && !isAssigned)
                {
                    db.Drivers.Remove(Driver);
                    await db.SaveChangesAsync();
                }

                //Add Driver
                if (Driver == null && isAssigned)
                {
                    var d = new Driver();
                    d.FirstName = u.FirstName;
                    d.LastName = u.LastName;
                    d.UserId = curUser.Id;
                    d.Added = DateTime.Now;
                    d.Modified = DateTime.Now;
                    db.Drivers.Add(d);
                    await db.SaveChangesAsync();
                }

                return u;
            }
            else
            {
                return null;
            }
        }


        [HttpPost("[action]")]
        public IActionResult DeleteUser(ApplicationUser u)
        {
            return Ok();
        }
    }
}