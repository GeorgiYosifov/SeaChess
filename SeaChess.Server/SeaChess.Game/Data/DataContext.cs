using Microsoft.EntityFrameworkCore;

namespace SeaChess.Game.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public DbSet<Playground> Playgrounds { get; set; }

        public DbSet<Player> Players { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
