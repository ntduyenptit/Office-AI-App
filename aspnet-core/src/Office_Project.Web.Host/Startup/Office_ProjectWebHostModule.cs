using Abp.Modules;
using Abp.Reflection.Extensions;
using Office_Project.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Office_Project.Web.Host.Startup
{
    [DependsOn(
       typeof(Office_ProjectWebCoreModule))]
    public class Office_ProjectWebHostModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public Office_ProjectWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(Office_ProjectWebHostModule).GetAssembly());
        }
    }
}
