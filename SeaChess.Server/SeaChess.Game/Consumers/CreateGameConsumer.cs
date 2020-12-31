using MassTransit;
using Microsoft.Extensions.Logging;
using Models;
using SeaChess.Game.Data;
using SeaChess.Game.Services;
using System.Threading.Tasks;

namespace SeaChess.Game.Consumers
{
    public class CreateGameConsumer : IConsumer<TransferSelectedUsersToGame>
    {
        private readonly ILogger<CreateGameConsumer> logger;
        private readonly IGameService gameService;

        public CreateGameConsumer(ILogger<CreateGameConsumer> logger,
            IGameService gameService)
        {
            this.logger = logger;
            this.gameService = gameService;
        }

        public async Task Consume(ConsumeContext<TransferSelectedUsersToGame> context)
        {
            this.logger.LogInformation($"Got new message {context.Message.FirstUserId} {context.Message.SecondUserId}");

            var result = await this.gameService.CreateGameAsync(context.Message.GameId,
                new Player { Id = context.Message.FirstUserId, Email = context.Message.FirstUserEmail, Score = 0 },
                new Player { Id = context.Message.SecondUserId, Email = context.Message.SecondUserEmail, Score = 0 });

            await context.RespondAsync<SavedData>(new
            {
                Result = result
            });
        }
    }
}
