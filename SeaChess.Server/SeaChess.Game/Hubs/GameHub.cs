using Microsoft.AspNetCore.SignalR;
using SeaChess.Game.Services;
using SeaChess.Game.ViewModels;

namespace SeaChess.Game.Hubs
{
    public class GameHub : Hub
    {
        private readonly IGameService gameService;

        public GameHub(IGameService gameService)
        {
            this.gameService = gameService;
        }

        public GameViewModel GetGameInfo(string gameId)
        {
            return this.gameService.FetchGameInfo(gameId);
        }
    }
}
