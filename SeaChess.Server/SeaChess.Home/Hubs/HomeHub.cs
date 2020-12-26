using Microsoft.AspNetCore.SignalR;
using SeaChess.Home.Services;
using System.Threading.Tasks;

namespace SeaChess.Home.Hubs
{
    public class HomeHub : Hub
    {
        private readonly IHomeService homeService;
        //private readonly IRequestClient<TransferSelectedUsersToGame> client;

        public HomeHub(IHomeService homeService)
        {
            this.homeService = homeService;
        }

        public override async Task OnConnectedAsync()
        {
            var users = this.homeService.GetUsers();
            await this.Clients.All.SendAsync("SendUsers", users);

            await base.OnConnectedAsync();
        }

        public async Task ChangeUserStatus(string id, string status)
        {
            var users = this.homeService.ChangeUserStatus(id, status);
            await this.Clients.All.SendAsync("SendUsers", users);
        }

        public async Task DeleteUserFromCache(string id)
        {
            var users = this.homeService.DeleteUser(id);
            await this.Clients.Others.SendAsync("SendUsers", users);
        }
    }
}