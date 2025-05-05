using Abp.Application.Services;
using Office_Project.Sessions.Dto;
using System.Threading.Tasks;

namespace Office_Project.Sessions;

public interface ISessionAppService : IApplicationService
{
    Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
}
