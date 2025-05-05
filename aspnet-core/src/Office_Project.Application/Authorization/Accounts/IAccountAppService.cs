using Abp.Application.Services;
using Office_Project.Authorization.Accounts.Dto;
using System.Threading.Tasks;

namespace Office_Project.Authorization.Accounts;

public interface IAccountAppService : IApplicationService
{
    Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

    Task<RegisterOutput> Register(RegisterInput input);
}
