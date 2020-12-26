using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Models;
using SeaChess.MatchMaker.Extensions;
using SeaChess.MatchMaker.Services;
using SeaChess.MatchMaker.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SeaChess.MatchMaker.Hubs
{
    public class MatchMakerHub : Hub
    {
        private readonly IMatchMakerService matchMakerService;
        private readonly IPublishEndpoint publishEndpoint;

        public MatchMakerHub(IMatchMakerService matchMakerService, IPublishEndpoint publishEndpoint)
        {
            this.matchMakerService = matchMakerService;
            this.publishEndpoint = publishEndpoint;
        }

        public async Task SendedUsersFromState(IList<UserInQueueViewModel> users)
        {
            var lastUserInQueue = users[users.Count - 1];
            UserInQueueViewModel selectedUser = null;

            for (int i = 0; i < users.Count - 1; i++)
            {
                var differenceInLevel = Math.Abs(users[i].Level - lastUserInQueue.Level);
                if (differenceInLevel < 2)
                {
                    selectedUser = users[i];
                    break;
                }
            }

            if (selectedUser != null)
            {
                await this.publishEndpoint.Publish<TransferSelectedUsersToGame>(new
                {
                    FirstUserId = selectedUser.Id,
                    SecondUserId = lastUserInQueue.Id
                });

                await Groups.AddToGroupAsync(Context.ConnectionId, "Game1");

                foreach (var kvp in UserHandler.ConnectedIds)
                {
                    if (selectedUser.Id == kvp.Value)
                    {
                        await Groups.AddToGroupAsync(kvp.Key, "Game1");
                        break;
                    }
                }

                await this.Clients.Group("Game1").SendAsync("SendUsersToGame");
            }
            else
            {
                UserHandler.ConnectedIds.Add(Context.ConnectionId, lastUserInQueue.Id);
            }
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            UserHandler.ConnectedIds.Remove(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}

//var s = Context.GetHttpContext().RequestServices.GetRequiredService<IResponseCacheService>();
