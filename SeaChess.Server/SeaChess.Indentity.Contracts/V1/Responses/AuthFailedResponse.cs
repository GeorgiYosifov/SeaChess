using System.Collections.Generic;

namespace SeaChess.Identity.Contracts.V1.Responses
{
    public class AuthFailedResponse
    {
        public IEnumerable<string> Errors { get; set; }
    }
}
