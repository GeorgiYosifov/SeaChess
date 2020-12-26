FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster as build

ARG BUILDCONFIG=RELEASE
ARG VERSION=1.0.0

COPY SeaChess.Home.csproj /build/

RUN dotnet restore ./build/SeaChess.Home.csproj

COPY . ./build/
WORKDIR /build/
RUN dotnet publish ./SeaChess.Home.csproj -c $BUILDCONFIG -o out /p:Version=$VERSION

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim
WORKDIR /app

COPY --from=build /build/out .

ENTRYPOINT ["dotnet", "SeaChess.Home.dll"]