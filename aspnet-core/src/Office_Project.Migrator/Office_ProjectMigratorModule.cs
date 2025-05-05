using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Office_Project.Configuration;
using Office_Project.EntityFrameworkCore;
using Office_Project.Migrator.DependencyInjection;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;

namespace Office_Project.Migrator;

[DependsOn(typeof(Office_ProjectEntityFrameworkModule))]
public class Office_ProjectMigratorModule : AbpModule
{
    private readonly IConfigurationRoot _appConfiguration;

    public Office_ProjectMigratorModule(Office_ProjectEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

        _appConfiguration = AppConfigurations.Get(
            typeof(Office_ProjectMigratorModule).GetAssembly().GetDirectoryPathOrNull()
        );
    }

    public override void PreInitialize()
    {
        Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
            Office_ProjectConsts.ConnectionStringName
        );

        Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        Configuration.ReplaceService(
            typeof(IEventBus),
            () => IocManager.IocContainer.Register(
                Component.For<IEventBus>().Instance(NullEventBus.Instance)
            )
        );
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(Office_ProjectMigratorModule).GetAssembly());
        ServiceCollectionRegistrar.Register(IocManager);
    }
}
