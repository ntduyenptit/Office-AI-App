using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Office_Project.MultiTenancy;

namespace Office_Project.Sessions.Dto;

[AutoMapFrom(typeof(Tenant))]
public class TenantLoginInfoDto : EntityDto
{
    public string TenancyName { get; set; }

    public string Name { get; set; }
}
