using Microsoft.AspNetCore.Http;
using ServiceStack.Redis;
using ServiceStack.Redis.Generic;
using System.Linq;

namespace SeaChess.Home.Extensions
{
    public static class GeneralExtensions
    {
        public static string GetUserId(this HttpContext httpContext)
        {
            if (httpContext.User == null)
            {
                return string.Empty;
            }

            return httpContext.User.Claims.Single(c => c.Type == "id").Value;
        }

        public static IRedisTypedClient<T> GetRedisInstance<T>()
        {
            using var redisClient = new RedisClient("localhost:6379");
            return redisClient.As<T>();
        }
    }
}
