using Abp.Authorization;
using Abp.Domain.Uow;
using Office_Project.Authorization.Roles;
using Office_Project.Authorization.Users;
using Office_Project.MultiTenancy;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Office_Project.Identity;

public class SecurityStampValidator : AbpSecurityStampValidator<Tenant, Role, User>
{
    public SecurityStampValidator(
        IOptions<SecurityStampValidatorOptions> options,
        SignInManager signInManager,
        ILoggerFactory loggerFactory,
        IUnitOfWorkManager unitOfWorkManager)
        : base(options, signInManager, loggerFactory, unitOfWorkManager)
    {
    }
}
