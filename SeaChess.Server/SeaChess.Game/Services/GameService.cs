﻿using SeaChess.Game.Data;
using SeaChess.Game.ViewModels;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SeaChess.Game.Services
{
    public class GameService : IGameService
    {
        private readonly DataContext db;

        public GameService(DataContext db)
        {
            this.db = db;
        }

        public async Task<bool> CreateGameAsync(string gameId, Player firstPlayer, Player secondPlayer)
        {
            try
            {
                await this.db.Games.AddAsync(new Data.Game()
                {
                    Id = gameId,
                    FirstPlayer = firstPlayer,
                    SecondPlayer = secondPlayer
                });

                await this.db.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public GameViewModel FetchGameInfo(string gameId)
        {
            return this.db.Games
                .Select(g => new GameViewModel()
                {
                    Id = g.Id,
                    FirstPlayer = new PlayerViewModel()
                    {
                        Id = g.FirstPlayerId,
                        Email = g.FirstPlayer.Email,
                        Score = g.FirstPlayer.Score
                    },
                    SecondPlayer = new PlayerViewModel()
                    {
                        Id = g.SecondPlayerId,
                        Email = g.SecondPlayer.Email,
                        Score = g.SecondPlayer.Score
                    }
                })
                .FirstOrDefault(g => g.Id == gameId);
        }

        //public string GetEmailFromJwtToken(string token)
        //{
        //    var stream = token;
        //    var handler = new JwtSecurityTokenHandler();
        //    //var jsonToken = handler.ReadToken(stream);
        //    var tokenS = handler.ReadToken(stream) as JwtSecurityToken;

        //    var email = tokenS.Claims.First(claim => claim.Type == "email").Value;

        //    return email;
        //}
    }
}