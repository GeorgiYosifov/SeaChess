using SeaChess.Home.Contracts.V1;
using SeaChess.Home.Contracts.V1.Requests;
using SeaChess.Home.Contracts.V1.Responses;
using SeaChess.Home.Data;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using SeaChess.Home;

namespace SeaChess.IntegrationTests
{
    //public class IntegrationTest : IDisposable
    //{
    //    protected readonly HttpClient TestClient;
    //    private readonly IServiceProvider serviceProvider;

    //    protected IntegrationTest()
    //    {
    //        var appFactory = new WebApplicationFactory<Startup>()
    //            .WithWebHostBuilder(builder =>
    //            {
    //                builder.ConfigureServices(services =>
    //                {
    //                    var descriptor = services
    //                        .SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<DbContext>));
    //                    if (descriptor != null)
    //                    {
    //                        services.Remove(descriptor);
    //                    }

    //                    services.AddDbContext<DbContext>(options =>
    //                    {
    //                        options.UseInMemoryDatabase("TestDb");
    //                    });
    //                });
    //            });

    //        serviceProvider = appFactory.Services;
    //        TestClient = appFactory.CreateClient();
    //    }

    //    protected async Task<AuthSuccessResponse> CreateRefreshTokenAsync(RefreshTokenRequest request)
    //    {
    //        var response = await TestClient.PostAsJsonAsync(ApiRoutes.Identity.Refresh, request);
    //        return await response.Content.ReadAsAsync<AuthSuccessResponse>();
    //    }

    //    protected async Task AuthenticateAsync()
    //    {
    //        var token = await GetJwtAsync();
    //        this.TestClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", token);
    //    }

    //    private async Task<string> GetJwtAsync()
    //    {
    //        var response = await TestClient.PostAsJsonAsync(ApiRoutes.Identity.Register, new UserRegistrationRequest
    //        {
    //            Email = "tonte4@abv.com",
    //            Password = "tonte123453"
    //        });

    //        var registrationResponse = await response.Content.ReadAsAsync<AuthSuccessResponse>();
    //        return registrationResponse.Token;
    //    }
    //    public void Dispose()
    //    {
    //        using var serviceScope = serviceProvider.CreateScope();
    //        var context = serviceScope.ServiceProvider.GetService<DataContext>();
    //        context.Database.EnsureDeleted();
    //    }
    //}
}
