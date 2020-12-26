using SeaChess.Home.Contracts.V1.Responses;
using ServiceStack.Redis.Generic;

namespace SeaChess.Home.Services
{
    public interface IHomeService
    {
        void AddUser(string id, string email, int level, string status);

        IRedisList<UserHomeViewModel> ChangeUserStatus(string id, string status);

        IRedisList<UserHomeViewModel> GetUsers();

        IRedisList<UserHomeViewModel> DeleteUser(string id);
    }
}
