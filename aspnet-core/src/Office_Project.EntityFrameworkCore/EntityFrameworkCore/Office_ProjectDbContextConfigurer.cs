using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace Office_Project.EntityFrameworkCore;

public static class Office_ProjectDbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<Office_ProjectDbContext> builder, string connectionString)
    {
        builder.UseSqlServer(connectionString);
    }

    public static void Configure(DbContextOptionsBuilder<Office_ProjectDbContext> builder, DbConnection connection)
    {
        builder.UseSqlServer(connection);
    }
}
