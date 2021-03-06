﻿using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;

namespace SeaChess.Indentity.Tests
{
    public static class FakeJwtManager
    {
        private static readonly JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

        private static readonly RandomNumberGenerator generator = RandomNumberGenerator.Create();

        private static readonly byte[] key = new byte[32];

        static FakeJwtManager()
        {
            generator.GetBytes(key);
            SecurityKey = new SymmetricSecurityKey(key) { KeyId = Guid.NewGuid().ToString() };
            SigningCredentials = new SigningCredentials(SecurityKey, SecurityAlgorithms.HmacSha256);
        }

        public static string Issuer { get; } = Guid.NewGuid().ToString();

        public static string Audience { get; } = Guid.NewGuid().ToString();

        public static SecurityKey SecurityKey { get; }

        public static SigningCredentials SigningCredentials { get; }

        public static string GenerateJwtToken()
        {
            return tokenHandler.WriteToken(new JwtSecurityToken(Issuer, Audience, null, null, DateTime.UtcNow.AddMinutes(10), SigningCredentials));
        }
    }
}
