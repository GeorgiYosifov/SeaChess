using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Models;
using SeaChess.Home.Hubs;
using SeaChess.Home.Services;
using System.Threading.Tasks;

namespace SeaChess.Home.Consumers
{
    public class ChangeStatusToGameConsumer : IConsumer<TransferSelectedUsersToGame>
    {
        private readonly ILogger<LoginConsumer> logger;
        private readonly IHomeService homeService;
        private readonly IHubContext<HomeHub> homeHubContext;

        public ChangeStatusToGameConsumer(ILogger<LoginConsumer> logger, IHomeService homeService, IHubContext<HomeHub> homeHubContext)
        {
            this.logger = logger;
            this.homeService = homeService;
            this.homeHubContext = homeHubContext;
        }

        public async Task Consume(ConsumeContext<TransferSelectedUsersToGame> context)
        {
            this.logger.LogInformation($"Got new message {context.Message.FirstUserId} {context.Message.SecondUserId}");
            this.homeService.ChangeUserStatus(context.Message.FirstUserId, "Game");
            var users = this.homeService.ChangeUserStatus(context.Message.SecondUserId, "Game");

            await this.homeHubContext.Clients.All.SendAsync("SendUsers", users);
        }
    }
}
