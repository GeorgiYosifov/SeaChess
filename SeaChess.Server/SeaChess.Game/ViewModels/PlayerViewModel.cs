namespace SeaChess.Game.ViewModels
{
    public class PlayerViewModel
    {
        public string Id { get; set; }

        public string Email { get; set; }

        public int Score { get; set; }

        public IconType IconType { get; set; }

        public CellViewModel[] Movements { get; set; }

        public int Time { get; set; }
    }
}
