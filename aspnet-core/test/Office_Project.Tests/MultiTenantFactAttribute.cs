using Xunit;

namespace Office_Project.Tests;

public sealed class MultiTenantFactAttribute : FactAttribute
{
    public MultiTenantFactAttribute()
    {
        if (!Office_ProjectConsts.MultiTenancyEnabled)
        {
            Skip = "MultiTenancy is disabled.";
        }
    }
}
