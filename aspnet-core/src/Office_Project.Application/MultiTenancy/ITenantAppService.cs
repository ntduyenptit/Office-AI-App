using Abp.Application.Services;
using Office_Project.MultiTenancy.Dto;

namespace Office_Project.MultiTenancy;

public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
{
}

