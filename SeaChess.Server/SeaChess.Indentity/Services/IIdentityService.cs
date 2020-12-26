using System.Threading.Tasks;
using SeaChess.Identity.Contracts.V1.Responses;
using SeaChess.Identity.Domain;

namespace SeaChess.Identity.Services
{
    public interface IIdentityService
    {
        Task<PlayerInfoForQueueResponse> GetPlayerInfoAsync(string email);

        Task<AuthenticationResult> RegisterAsync(string email, string password);

        Task<AuthenticationResult> LoginAsync(string email, string password);

        Task<AuthenticationResult> RefreshTokenAsync(string token, string refreshToken);
    }
}
