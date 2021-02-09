using Microsoft.AspNetCore.SignalR;
using SeaChess.Game.Services;
using SeaChess.Game.ViewModels;
using System;
using System.Threading.Tasks;

namespace SeaChess.Game.Hubs
{
    public class GameHub : Hub
    {
        private readonly IGameService gameService;

        public GameHub(IGameService gameService)
        {
            this.gameService = gameService;
        }

        public async Task CreateGroup(string gameId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
        }

        public GameViewModel GetGameInfo(string gameId)
        {
            return this.gameService.GetGameInfo(gameId);
        }

        public async Task ChangeTurn(ChangeTurnInfoViewModel changeTurnInfo)
        {
            await Clients.OthersInGroup(changeTurnInfo.GameId).SendAsync("YourTurn", changeTurnInfo);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            //this.gameService.RemovePlayer(playerId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
