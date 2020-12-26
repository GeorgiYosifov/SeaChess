using SeaChess.Home.Contracts.V1.Responses;
using SeaChess.Home.Extensions;
using ServiceStack.Redis.Generic;
using System.Linq;

namespace SeaChess.Home.Services
{
    public class HomeService : IHomeService
    {
        public IRedisList<UserHomeViewModel> GetUsers()
        {
            var redisUsers = GeneralExtensions.GetRedisInstance<UserHomeViewModel>();
            return redisUsers.Lists["users"];
        }

        public void AddUser(string id, string email, int level, string status)
        {
            this.GetUsers().Add(new UserHomeViewModel
            {
                Id = id,
                Email = email,
                Level = level,
                Status = status
            });
        }

        public IRedisList<UserHomeViewModel> ChangeUserStatus(string id, string status)
        {
            var user = this.GetUsers().FirstOrDefault(u => u.Id == id);
            this.DeleteUser(id);
            this.AddUser(user.Id, user.Email, user.Level, status);
            return this.GetUsers();
        }

        public IRedisList<UserHomeViewModel> DeleteUser(string id)
        {
            var users = this.GetUsers();
            var user = users.FirstOrDefault(u => u.Id == id);
            if (user != null)
            {
                users.RemoveValue(user);
            }

            return users;
        }
    }
}
