namespace SeaChess.Home.Contracts.V1.Requests
{
    public class SendUsersToGameRequest
    {
        public string FirstUserId { get; set; }

        public string SecondUserId { get; set; }
    }
}
