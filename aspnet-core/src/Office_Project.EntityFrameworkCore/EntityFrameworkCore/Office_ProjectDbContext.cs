using Abp.Zero.EntityFrameworkCore;
using Office_Project.Authorization.Roles;
using Office_Project.Authorization.Users;
using Office_Project.MultiTenancy;
using Microsoft.EntityFrameworkCore;

namespace Office_Project.EntityFrameworkCore;

public class Office_ProjectDbContext : AbpZeroDbContext<Tenant, Role, User, Office_ProjectDbContext>
{
    /* Define a DbSet for each entity of the application */

    public Office_ProjectDbContext(DbContextOptions<Office_ProjectDbContext> options)
        : base(options)
    {
    }
}
