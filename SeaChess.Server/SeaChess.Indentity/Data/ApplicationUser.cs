using Microsoft.AspNetCore.Identity;

namespace SeaChess.Identity.Data
{
    public class ApplicationUser : IdentityUser
    {
        public ApplicationUser()
        {
            this.Level = 1;
        }

        public int Level { get; set; }
    }
}
