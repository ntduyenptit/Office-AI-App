using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Office_Project.EntityFrameworkCore;
using Office_Project.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace Office_Project.Web.Tests;

[DependsOn(
    typeof(Office_ProjectWebMvcModule),
    typeof(AbpAspNetCoreTestBaseModule)
)]
public class Office_ProjectWebTestModule : AbpModule
{
    public Office_ProjectWebTestModule(Office_ProjectEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
    }

    public override void PreInitialize()
    {
        Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(Office_ProjectWebTestModule).GetAssembly());
    }

    public override void PostInitialize()
    {
        IocManager.Resolve<ApplicationPartManager>()
            .AddApplicationPartsIfNotAddedBefore(typeof(Office_ProjectWebMvcModule).Assembly);
    }
}