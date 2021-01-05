namespace SeaChess.Game.ViewModels
{
    public class GameViewModel
    {
        public string Id { get; set; }

        public PlayerViewModel FirstPlayer { get; set; }

        public PlayerViewModel SecondPlayer { get; set; }
    }
}
