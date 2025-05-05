using Abp.Authorization;
using Office_Project.Authorization.Roles;
using Office_Project.Authorization.Users;

namespace Office_Project.Authorization;

public class PermissionChecker : PermissionChecker<Role, User>
{
    public PermissionChecker(UserManager userManager)
        : base(userManager)
    {
    }
}
