using FluentAssertions;
using SeaChess.Home.Contracts.V1;
using SeaChess.Home.Contracts.V1.Requests;
using SeaChess.Home.Contracts.V1.Responses;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace SeaChess.IntegrationTests
{
    //public class IdentityControllerTests : IntegrationTest
    //{
    //    [Fact]
    //    public async Task Get_ReturnsLoginResponse_WhenUserExistsInTheDatabase()
    //    {
    //        // Arrange
    //        await AuthenticateAsync();
    //        var token = this.TestClient.DefaultRequestHeaders.Authorization.Parameter;

    //        // Act
    //        var response = await base.TestClient.PostAsJsonAsync(ApiRoutes.Identity.Login, new UserLoginRequest
    //        {
    //            Email = "tonte3@abv.com",
    //            Password = "tonte123457"
    //        });

    //        // Assert
    //        response.StatusCode.Should().Be(HttpStatusCode.OK);
    //        var loginResponse = await response.Content.ReadAsAsync<AuthSuccessResponse>();
    //        loginResponse.Token.Should().Be(token);
    //    }
    //}
}
