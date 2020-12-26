using SeaChess.MatchMaker.Extensions;
using SeaChess.MatchMaker.ViewModels;
using ServiceStack.Redis.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace SeaChess.MatchMaker.Services
{
    public class MatchMakerService : IMatchMakerService
    {
        public IRedisList<UserInQueueViewModel> GetPlayers()
        {
            var redisUsers = GeneralExtensions.GetRedisInstance<UserInQueueViewModel>();
            return redisUsers.Lists["queue"];
        }

        public void AddPlayerToQueue(string email, int level)
        {
            this.GetPlayers().Add(new UserInQueueViewModel
            {
                Email = email,
                Level = level
            });
        }

        public string GetEmailFromJwtToken(string token)
        {
            var stream = token;
            var handler = new JwtSecurityTokenHandler();
            //var jsonToken = handler.ReadToken(stream);
            var tokenS = handler.ReadToken(stream) as JwtSecurityToken;

            var email = tokenS.Claims.First(claim => claim.Type == "email").Value;

            return email;
        }
    }
}