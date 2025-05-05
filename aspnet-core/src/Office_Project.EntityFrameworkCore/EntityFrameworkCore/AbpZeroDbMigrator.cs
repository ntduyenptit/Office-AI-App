using Abp.Domain.Uow;
using Abp.EntityFrameworkCore;
using Abp.MultiTenancy;
using Abp.Zero.EntityFrameworkCore;

namespace Office_Project.EntityFrameworkCore;

public class AbpZeroDbMigrator : AbpZeroDbMigrator<Office_ProjectDbContext>
{
    public AbpZeroDbMigrator(
        IUnitOfWorkManager unitOfWorkManager,
        IDbPerTenantConnectionStringResolver connectionStringResolver,
        IDbContextResolver dbContextResolver)
        : base(
            unitOfWorkManager,
            connectionStringResolver,
            dbContextResolver)
    {
    }
}
