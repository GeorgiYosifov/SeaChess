using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Models;
using SeaChess.Game.Hubs;
using SeaChess.Game.Services;
using System.Threading.Tasks;

namespace SeaChess.Game.Consumers
{
    public class CreatePlaygroundConsumer : IConsumer<TransferSelectedUsersToGame>
    {
        private readonly ILogger<CreatePlaygroundConsumer> logger;
        private readonly IGameService gameService;
        private readonly IHubContext<GameHub> gameHubContext;

        public CreatePlaygroundConsumer(ILogger<CreatePlaygroundConsumer> logger,
            IGameService gameService, IHubContext<GameHub> gameHubContext)
        {
            this.logger = logger;
            this.gameService = gameService;
            this.gameHubContext = gameHubContext;
        }

        public async Task Consume(ConsumeContext<TransferSelectedUsersToGame> context)
        {
            this.logger.LogInformation($"Got new message {context.Message.FirstUserId} {context.Message.SecondUserId}");

        }
    }
}
