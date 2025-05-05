using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace Office_Project.Controllers
{
    public abstract class Office_ProjectControllerBase : AbpController
    {
        protected Office_ProjectControllerBase()
        {
            LocalizationSourceName = Office_ProjectConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
