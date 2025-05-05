using Abp.Localization;
using Abp.Modules;
using Abp.Reflection.Extensions;
using Abp.Runtime.Security;
using Abp.Timing;
using Abp.Zero;
using Abp.Zero.Configuration;
using Office_Project.Authorization.Roles;
using Office_Project.Authorization.Users;
using Office_Project.Configuration;
using Office_Project.Localization;
using Office_Project.MultiTenancy;
using Office_Project.Timing;

namespace Office_Project;

[DependsOn(typeof(AbpZeroCoreModule))]
public class Office_ProjectCoreModule : AbpModule
{
    public override void PreInitialize()
    {
        Configuration.Auditing.IsEnabledForAnonymousUsers = true;

        // Declare entity types
        Configuration.Modules.Zero().EntityTypes.Tenant = typeof(Tenant);
        Configuration.Modules.Zero().EntityTypes.Role = typeof(Role);
        Configuration.Modules.Zero().EntityTypes.User = typeof(User);

        Office_ProjectLocalizationConfigurer.Configure(Configuration.Localization);

        // Enable this line to create a multi-tenant application.
        Configuration.MultiTenancy.IsEnabled = Office_ProjectConsts.MultiTenancyEnabled;

        // Configure roles
        AppRoleConfig.Configure(Configuration.Modules.Zero().RoleManagement);

        Configuration.Settings.Providers.Add<AppSettingProvider>();

        Configuration.Localization.Languages.Add(new LanguageInfo("fa", "فارسی", "famfamfam-flags ir"));

        Configuration.Settings.SettingEncryptionConfiguration.DefaultPassPhrase = Office_ProjectConsts.DefaultPassPhrase;
        SimpleStringCipher.DefaultPassPhrase = Office_ProjectConsts.DefaultPassPhrase;
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(Office_ProjectCoreModule).GetAssembly());
    }

    public override void PostInitialize()
    {
        IocManager.Resolve<AppTimes>().StartupTime = Clock.Now;
    }
}
