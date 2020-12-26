using ServiceStack.Redis;
using ServiceStack.Redis.Generic;

namespace SeaChess.MatchMaker.Extensions
{
    public static class GeneralExtensions
    {
        public static IRedisTypedClient<T> GetRedisInstance<T>()
        {
            using var redisClient = new RedisClient("localhost:6379");
            return redisClient.As<T>();
        }
    }
}
