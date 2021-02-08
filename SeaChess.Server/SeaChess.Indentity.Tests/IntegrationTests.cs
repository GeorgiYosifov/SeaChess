using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;
using Newtonsoft.Json;
using SeaChess.Identity;
using SeaChess.Identity.Contracts.V1.Responses;
using SeaChess.Identity.Data;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace SeaChess.Indentity.Tests
{
    public class IntegrationTests : IClassFixture<CustomWebApplicationFactory<Startup>>
    {
        private readonly HttpClient httpClient;

        public IntegrationTests(CustomWebApplicationFactory<Startup> factory)
        {
            httpClient = factory.CreateClient();
        }

        [Fact]
        public async Task Get_ReturnsLoginResponse_WhenUserExistsInTheDatabase()
        {
            // Arrange
            var userManager = new Mock<CustomUserManager>();
            userManager.Setup(x =>
                x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            var dbContext = IdentityServiceTests.GetDatabaseContext();
            await IdentityServiceTests.SeedUsers(dbContext, userManager.Object);

            var url = "https://localhost:5003/api/v1/identity/login";
            var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(System.Text.Json.JsonSerializer.Serialize(new
                {
                    Email = "kirel1@abv.bg",
                    Password = "kirel1"
                }), Encoding.UTF8, "application/json")
            };

            //var accessToken = FakeJwtManager.GenerateJwtToken();
            //request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            // Act
            HttpResponseMessage response = new HttpResponseMessage();
            try
            {
                response = await httpClient.SendAsync(request);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            // Assert
            var responseAsString = await response.Content.ReadAsStringAsync();
            var authSuccessResponse = JsonConvert.DeserializeObject<AuthSuccessResponse>(responseAsString);
            //authSuccessResponse.Should().Be(new AuthSuccessResponse());
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
