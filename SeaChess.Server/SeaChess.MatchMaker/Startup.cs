using MassTransit;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Models;
using SeaChess.MatchMaker.Hubs;

namespace SeaChess.MatchMaker
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
            //services.AddAutoMapper(typeof(Startup));

            services.AddSignalR(options => options.EnableDetailedErrors = true);

            services.AddControllers();

            services.AddMassTransit(config =>
            {
                config.AddBus(context => Bus.Factory.CreateUsingRabbitMq(c =>
                {
                    c.Host("amqp://guest:guest@localhost:5672");
                    c.ConfigureEndpoints(context);
                }));

                config.AddRequestClient<TransferSelectedUsersToGame>();
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
                endpoints.MapHub<MatchMakerHub>("/matchMaker");
            });
        }
    }
}
