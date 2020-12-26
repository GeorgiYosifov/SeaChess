namespace Models
{
    public interface TransferSelectedUsersToGame
    {
        public string GameId { get; set; }

        public string FirstUserId { get; set; }

        public string FirstUserEmail { get; set; }

        public string SecondUserId { get; set; }

        public string SecondUserEmail { get; set; }

    }
}
