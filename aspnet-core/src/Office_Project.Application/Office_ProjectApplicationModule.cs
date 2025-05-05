using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Office_Project.Authorization;

namespace Office_Project;

[DependsOn(
    typeof(Office_ProjectCoreModule),
    typeof(AbpAutoMapperModule))]
public class Office_ProjectApplicationModule : AbpModule
{
    public override void PreInitialize()
    {
        Configuration.Authorization.Providers.Add<Office_ProjectAuthorizationProvider>();
    }

    public override void Initialize()
    {
        var thisAssembly = typeof(Office_ProjectApplicationModule).GetAssembly();

        IocManager.RegisterAssemblyByConvention(thisAssembly);

        Configuration.Modules.AbpAutoMapper().Configurators.Add(
            // Scan the assembly for classes which inherit from AutoMapper.Profile
            cfg => cfg.AddMaps(thisAssembly)
        );
    }
}
