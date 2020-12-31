using SeaChess.Game.Data;
using System.Threading.Tasks;

namespace SeaChess.Game.Services
{
    public interface IGameService
    {
        Task<bool> CreateGameAsync(string gameId, Player firstPlayer, Player secondPlayer);

        //string GetEmailFromJwtToken(string token);
    }
}