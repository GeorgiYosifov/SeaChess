using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Moq;
using SeaChess.Identity.Contracts.V1.Responses;
using SeaChess.Identity.Data;
using SeaChess.Identity.Options;
using SeaChess.Identity.Services;
using System;
using System.Threading.Tasks;
using Xunit;
using FluentAssertions;
using AutoFixture;

namespace SeaChess.Indentity.Tests
{
    public class IdentityServiceTests
    {
        [Fact]
        public async Task GetPlayerInfoAsync_Should_Return_Player_Info()
        {
            //var f = new Fixture();
            //var userManager = f.Create<Mock<CustomUserManager>>();
            var userManager = new Mock<CustomUserManager>();
            userManager.Setup(x =>
                x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            var dbContext = GetDatabaseContext();
            await SeedUsers(dbContext, userManager.Object);

            var identityService = new IdentityService(userManager.Object,
                new JwtSettings(),
                new TokenValidationParameters(),
                dbContext);

            var user = await identityService.GetPlayerInfoAsync("testuser1@example.com");

            var result = new PlayerInfoForQueueResponse
            {
                Id = "1",
                Email = "testuser1@example.com",
                Level = 0
            };
            result.Should().Equals(user);
        }

        [Fact]
        public async Task LoginAsync_Should_Return_Invalid_Email()
        {
            ApplicationUser fakeUser = null;

            var userManager = new Mock<CustomUserManager>();
            userManager.Setup(x =>
                x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);
            userManager.Setup(x =>
                x.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(fakeUser);

            var dbContext = GetDatabaseContext();
            await SeedUsers(dbContext, userManager.Object);

            var identityService = new IdentityService(userManager.Object,
                new JwtSettings(),
                new TokenValidationParameters(),
                dbContext);

            var result = await identityService.LoginAsync("testuser0@example.com", "kirel1");

            var response = new AuthenticationResult
            {
                Errors = new[] { "User does not exist" }
            };
            response.Should().Equals(result);
        }

        [Fact]
        public async Task LoginAsync_Should_Return_Invalid_Password()
        {
            var userManager = new Mock<CustomUserManager>();
            userManager.Setup(x =>
                x.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);
            userManager.Setup(x =>
                x.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(new ApplicationUser());
            userManager.Setup(x =>
                x.CheckPasswordAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
                .ReturnsAsync(false);

            var dbContext = GetDatabaseContext();
            await SeedUsers(dbContext, userManager.Object);

            var identityService = new IdentityService(userManager.Object,
                new JwtSettings(),
                new TokenValidationParameters(),
                dbContext);

            var result = await identityService.LoginAsync("testuser1@example.com", "goshe");

            var response = new AuthenticationResult
            {
                Errors = new[] { "User/password combination is wrong" }
            };
            response.Should().Equals(result);
        }

        private DataContext GetDatabaseContext()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var dataContext = new DataContext(options);
            dataContext.Database.EnsureCreated();
            return dataContext;
        }

        private static async Task SeedUsers(DataContext dataContext, UserManager<ApplicationUser> userManager)
        {
            if (await dataContext.Users.CountAsync() <= 0)
            {
                for (int i = 1; i <= 10; i++)
                {
                    var newUser = new ApplicationUser
                    {
                        Id = i.ToString(),
                        Email = $"testuser{i}@example.com",
                        UserName = $"testuser{i}@example.com"
                    };

                    var createdUser = await userManager.CreateAsync(newUser, $"kirel{i}");
                    if (createdUser.Succeeded)
                    {
                        await dataContext.AddAsync(newUser);
                        await dataContext.SaveChangesAsync();
                    }
                }
            }
        }
    }

    public class CustomUserManager : UserManager<ApplicationUser>
    {
        public CustomUserManager()
            : base(new Mock<IUserStore<ApplicationUser>>().Object, null, null, null, null, null, null, null, null)
        { }
    }
}
