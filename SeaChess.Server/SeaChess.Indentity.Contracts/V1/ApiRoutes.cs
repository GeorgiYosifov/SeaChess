namespace SeaChess.Identity.Contracts.V1
{
    public static class ApiRoutes
    {
        internal const string Root = "api";
        internal const string Version = "v1";
        internal const string BasePath = Root + "/" + Version;

        public static class Identity
        {
            public const string Login = BasePath + "/identity/login";

            public const string Register = BasePath + "/identity/register";

            public const string Refresh = BasePath + "/identity/refresh";
        }
    }
}
