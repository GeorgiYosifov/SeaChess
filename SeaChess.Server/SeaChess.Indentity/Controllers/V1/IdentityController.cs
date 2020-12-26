using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using SeaChess.Identity.Services;
using SeaChess.Identity.Contracts.V1;
using SeaChess.Identity.Contracts.V1.Requests;
using SeaChess.Infrastructure;
using SeaChess.Identity.Contracts.V1.Responses;
using System.Linq;
using MassTransit;
using AutoMapper;
using Models;

namespace SeaChess.Identity.Controllers.V1
{
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin,Poster")]
    public class IdentityController : ApiController
    {
        private readonly IIdentityService identityService;
        private readonly IPublishEndpoint publishEndpoint;
        private readonly IMapper mapper;

        public IdentityController(IIdentityService identityService, IPublishEndpoint publishEndpoint, IMapper mapper)
        {
            this.identityService = identityService;
            this.publishEndpoint = publishEndpoint;
            this.mapper = mapper;
            //this.mapper.Map<List<PostResponse>>(posts); //in controller method
        }

        [HttpPost(ApiRoutes.Identity.Register)]
        public async Task<IActionResult> Register([FromBody] UserRegistrationRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                });
            }

            var authResponse = await identityService.RegisterAsync(request.Email, request.Password);

            if (!authResponse.Success)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = authResponse.Errors
                });
            }

            return Ok(new AuthSuccessResponse
            {
                Token = authResponse.Token,
                RefreshToken = authResponse.RefreshToken
            });
        }

        [HttpPost(ApiRoutes.Identity.Login)]
        [ProducesResponseType(typeof(AuthSuccessResponse), 200)]
        [ProducesResponseType(typeof(AuthFailedResponse), 400)]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
        {
            var authResponse = await identityService.LoginAsync(request.Email, request.Password);

            if (!authResponse.Success)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = authResponse.Errors
                });
            }

            var playerInfo = await this.identityService.GetPlayerInfoAsync(request.Email);
            await this.publishEndpoint.Publish<LoginTransferData>(new 
            { 
                playerInfo.Id,
                playerInfo.Email,
                playerInfo.Level
            });

            return Ok(new AuthSuccessResponse
            {
                Token = authResponse.Token,
                RefreshToken = authResponse.RefreshToken
            });
        }

        [HttpPost(ApiRoutes.Identity.Refresh)]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
        {
            var authResponse = await identityService.RefreshTokenAsync(request.Token, request.RefreshToken);

            if (!authResponse.Success)
            {
                return BadRequest(new AuthFailedResponse
                {
                    Errors = authResponse.Errors
                });
            }

            return Ok(new AuthSuccessResponse
            {
                Token = authResponse.Token,
                RefreshToken = authResponse.RefreshToken
            });
        }
    }
}
