using Microsoft.AspNetCore.Mvc;

namespace SeaChess.Infrastructure
{
    //[ApiController]
    //[Route("[controller]")]
    [Produces("application/json")]
    public abstract class ApiController : ControllerBase
    {
    }
}
