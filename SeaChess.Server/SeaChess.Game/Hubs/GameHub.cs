using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SeaChess.Game.Hubs
{
    public class GameHub : Hub
    {
        public async Task GetPlayersInfo(string gameId)
        {
            System.Console.WriteLine();
        }
    }
}
