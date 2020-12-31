using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Models;
using SeaChess.MatchMaker.Extensions;
using SeaChess.MatchMaker.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SeaChess.MatchMaker.Hubs
{
    public class MatchMakerHub : Hub
    {
        private readonly IRequestClient<TransferSelectedUsersToGame> client;

        public MatchMakerHub(IRequestClient<TransferSelectedUsersToGame> client)
        {
            this.client = client;
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
                var gameId = Guid.NewGuid().ToString();

                await Groups.AddToGroupAsync(Context.ConnectionId, gameId);

                foreach (var kvp in UserHandler.ConnectedIds)
                {
                    if (selectedUser.Id == kvp.Value)
                    {
                        await Groups.AddToGroupAsync(kvp.Key, gameId);
                        break;
                    }
                }
                
                var response = await client.GetResponse<SavedData>(new
                {
                    GameId = gameId,
                    FirstUserId = selectedUser.Id,
                    FirstUserEmail = selectedUser.Email,
                    SecondUserId = lastUserInQueue.Id,
                    SecondUserEmail = lastUserInQueue.Email,
                });

                if (response.Message.Result)
                {
                    await this.Clients.Group(gameId).SendAsync("SendUsersToGame");
                }
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
