using Abp.EntityFrameworkCore.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Zero.EntityFrameworkCore;
using Office_Project.EntityFrameworkCore.Seed;

namespace Office_Project.EntityFrameworkCore;

[DependsOn(
    typeof(Office_ProjectCoreModule),
    typeof(AbpZeroCoreEntityFrameworkCoreModule))]
public class Office_ProjectEntityFrameworkModule : AbpModule
{
    /* Used it tests to skip dbcontext registration, in order to use in-memory database of EF Core */
    public bool SkipDbContextRegistration { get; set; }

    public bool SkipDbSeed { get; set; }

    public override void PreInitialize()
    {
        if (!SkipDbContextRegistration)
        {
            Configuration.Modules.AbpEfCore().AddDbContext<Office_ProjectDbContext>(options =>
            {
                if (options.ExistingConnection != null)
                {
                    Office_ProjectDbContextConfigurer.Configure(options.DbContextOptions, options.ExistingConnection);
                }
                else
                {
                    Office_ProjectDbContextConfigurer.Configure(options.DbContextOptions, options.ConnectionString);
                }
            });
        }
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(Office_ProjectEntityFrameworkModule).GetAssembly());
    }

    public override void PostInitialize()
    {
        if (!SkipDbSeed)
        {
            SeedHelper.SeedHostDb(IocManager);
        }
    }
}
