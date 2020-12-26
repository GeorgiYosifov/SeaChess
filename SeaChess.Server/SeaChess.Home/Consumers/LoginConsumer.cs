using MassTransit;
using Microsoft.Extensions.Logging;
using Models;
using SeaChess.Home.Services;
using System.Threading.Tasks;

namespace SeaChess.Home.Consumers
{
    public class LoginConsumer : IConsumer<LoginTransferData>
    {
        private readonly ILogger<LoginConsumer> logger;
        private readonly IHomeService homeService;

        public LoginConsumer(ILogger<LoginConsumer> logger, IHomeService homeService)
        {
            this.logger = logger;
            this.homeService = homeService;
        }

        public async Task Consume(ConsumeContext<LoginTransferData> context)
        {
            this.logger.LogInformation($"Got new message {context.Message.Email}");
            this.homeService.AddUser(context.Message.Id, context.Message.Email, context.Message.Level, "");
        }
    }
}
