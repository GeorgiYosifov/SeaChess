namespace SeaChess.Game.Data
{
    public class Game
    {
        public string Id { get; set; }

        public string FirstPlayerId { get; set; }

        public Player FirstPlayer { get; set; }

        public string SecondPlayerId { get; set; }

        public Player SecondPlayer { get; set; }
    }
}
