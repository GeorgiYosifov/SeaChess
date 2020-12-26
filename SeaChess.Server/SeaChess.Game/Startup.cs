using MassTransit;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SeaChess.Game.Consumers;
using SeaChess.Game.Data;
using SeaChess.Game.Hubs;
using SeaChess.Game.Services;

namespace SeaChess.Game
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(options =>
                options.UseSqlServer(this.Configuration.GetConnectionString("DefaultConnection")));

            //services.AddAutoMapper(typeof(Startup));

            services.AddScoped<IGameService, GameService>();

            services.AddSignalR(options => options.EnableDetailedErrors = true);

            services.AddControllers();

            services.AddMassTransit(config =>
            {
                config.AddConsumer<CreatePlaygroundConsumer>();

                config.UsingRabbitMq((ctx, cfg) =>
                {
                    cfg.Host("amqp://guest:guest@localhost:5672");

                    cfg.ReceiveEndpoint("transferSelectedUsersToGame-queue", c =>
                    {
                        c.ConfigureConsumer<CreatePlaygroundConsumer>(ctx);
                    });
                });
            });

            services.AddMassTransitHostedService();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<GameHub>("/game");
            });
        }
    }
}
