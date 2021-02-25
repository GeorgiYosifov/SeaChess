namespace SeaChess.Game.ViewModels
{
    public class ChangeTurnInfoViewModel
    {
        public string GameId { get; set; }

        public int Turn { get; set; }

        public bool IsIncreasedScore { get; set; }

        public CellViewModel[] PointCells { get; set; }

        public PlayerViewModel PlayerOnTurn { get; set; }

        public string PlayerOnNextTurnId { get; set; }
    }
}
