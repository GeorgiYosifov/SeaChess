namespace SeaChess.Game.ViewModels
{
    public class ChangeTurnInfoViewModel
    {
        public string GameId { get; set; }

        public int Turn { get; set; }

        public string PlayerOnNextTurnId { get; set; }

        public string PlayerOnTurnId { get; set; }

        public MovementViewModel[] PlayerOnTurnMovements { get; set; }
    }
}
