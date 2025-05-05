FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["src/Office_Project.Web.Host/Office_Project.Web.Host.csproj", "src/Office_Project.Web.Host/"]
COPY ["src/Office_Project.Web.Core/Office_Project.Web.Core.csproj", "src/Office_Project.Web.Core/"]
COPY ["src/Office_Project.Application/Office_Project.Application.csproj", "src/Office_Project.Application/"]
COPY ["src/Office_Project.Core/Office_Project.Core.csproj", "src/Office_Project.Core/"]
COPY ["src/Office_Project.EntityFrameworkCore/Office_Project.EntityFrameworkCore.csproj", "src/Office_Project.EntityFrameworkCore/"]
WORKDIR "/src/src/Office_Project.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/Office_Project.Web.Host", "src/Office_Project.Web.Host"]
COPY ["src/Office_Project.Web.Core", "src/Office_Project.Web.Core"]
COPY ["src/Office_Project.Application", "src/Office_Project.Application"]
COPY ["src/Office_Project.Core", "src/Office_Project.Core"]
COPY ["src/Office_Project.EntityFrameworkCore", "src/Office_Project.EntityFrameworkCore"]
WORKDIR "/src/src/Office_Project.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "Office_Project.Web.Host.dll"]
