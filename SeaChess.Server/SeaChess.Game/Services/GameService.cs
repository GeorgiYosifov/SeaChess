using SeaChess.Game.Data;
using System;
using System.Threading.Tasks;

namespace SeaChess.Game.Services
{
    public class GameService : IGameService
    {
        private readonly DataContext db;

        public GameService(DataContext db)
        {
            this.db = db;
        }

        public async Task<bool> CreateGameAsync(string gameId, Player firstPlayer, Player secondPlayer)
        {
            try
            {
                await this.db.Games.AddAsync(new Data.Game()
                {
                    Id = gameId,
                    FirstPlayer = firstPlayer,
                    SecondPlayer = secondPlayer
                });

                await this.db.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        //public string GetEmailFromJwtToken(string token)
        //{
        //    var stream = token;
        //    var handler = new JwtSecurityTokenHandler();
        //    //var jsonToken = handler.ReadToken(stream);
        //    var tokenS = handler.ReadToken(stream) as JwtSecurityToken;

        //    var email = tokenS.Claims.First(claim => claim.Type == "email").Value;

        //    return email;
        //}
    }
}