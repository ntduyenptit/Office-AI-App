using Office_Project.Configuration;
using Office_Project.Web;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Office_Project.EntityFrameworkCore;

/* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
public class Office_ProjectDbContextFactory : IDesignTimeDbContextFactory<Office_ProjectDbContext>
{
    public Office_ProjectDbContext CreateDbContext(string[] args)
    {
        var builder = new DbContextOptionsBuilder<Office_ProjectDbContext>();

        /*
         You can provide an environmentName parameter to the AppConfigurations.Get method. 
         In this case, AppConfigurations will try to read appsettings.{environmentName}.json.
         Use Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") method or from string[] args to get environment if necessary.
         https://docs.microsoft.com/en-us/ef/core/cli/dbcontext-creation?tabs=dotnet-core-cli#args
         */
        var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

        Office_ProjectDbContextConfigurer.Configure(builder, configuration.GetConnectionString(Office_ProjectConsts.ConnectionStringName));

        return new Office_ProjectDbContext(builder.Options);
    }
}
