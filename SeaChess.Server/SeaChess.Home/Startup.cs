using AutoMapper;
using MassTransit;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SeaChess.Home.Consumers;
using SeaChess.Home.Hubs;
using SeaChess.Home.Installers;
using SeaChess.Home.Options;
using SeaChess.Home.Services;

namespace SeaChess.Home
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
            services.InstallerServicesInAssembly(Configuration);
            services.AddAutoMapper(typeof(Startup));

            services.AddScoped<IHomeService, HomeService>();

            services.AddSignalR(options => options.EnableDetailedErrors = true);

            services.AddMassTransit(config =>
            {
                config.AddConsumer<LoginConsumer>();
                config.AddConsumer<ChangeStatusToGameConsumer>();

                config.UsingRabbitMq((ctx, cfg) =>
                {
                    //config.AddRequestClient<TransferSelectedUsersToGame>();

                    cfg.Host("amqp://guest:guest@localhost:5672");

                    cfg.ReceiveEndpoint("login-queue", c =>
                    {
                        c.ConfigureConsumer<LoginConsumer>(ctx);
                    });
                    cfg.ReceiveEndpoint("transferSelectedUsersToGame-queue", c =>
                    {
                        c.ConfigureConsumer<ChangeStatusToGameConsumer>(ctx);
                    });
                });
            });

            services.AddMassTransitHostedService();

            services.AddControllers();
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

            var swaggerOptions = new SwaggerOptions();
            Configuration.GetSection(nameof(swaggerOptions)).Bind(swaggerOptions);
            app.UseSwagger()
               .UseSwaggerUI(option =>
               {
                   option.SwaggerEndpoint(swaggerOptions.UiEndpoint, swaggerOptions.Description);
                   option.RoutePrefix = string.Empty;
               });

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<HomeHub>("/home");
            });
        }
    }
}
