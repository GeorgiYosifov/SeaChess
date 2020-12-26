using SeaChess.MatchMaker.ViewModels;
using ServiceStack.Redis.Generic;

namespace SeaChess.MatchMaker.Services
{
    public interface IMatchMakerService
    {
        IRedisList<UserInQueueViewModel> GetPlayers();

        void AddPlayerToQueue(string email, int level);

        string GetEmailFromJwtToken(string token);
    }
}