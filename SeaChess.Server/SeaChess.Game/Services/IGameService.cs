using SeaChess.Game.Data;
using SeaChess.Game.ViewModels;
using System.Threading.Tasks;

namespace SeaChess.Game.Services
{
    public interface IGameService
    {
        Task<bool> CreateGameAsync(string gameId, Player firstPlayer, Player secondPlayer);

        GameViewModel FetchGameInfo(string gameId);

        //string GetEmailFromJwtToken(string token);
    }
}