using SeaChess.Game.Data;
using SeaChess.Game.ViewModels;
using System.Threading.Tasks;

namespace SeaChess.Game.Services
{
    public interface IGameService
    {
        Task<bool> CreateGameAsync(string gameId, Player firstPlayer, Player secondPlayer);

        GameViewModel GetGameInfo(string gameId);

        Task UploadGameInfo(string playerId, int playerScore);
    }
}