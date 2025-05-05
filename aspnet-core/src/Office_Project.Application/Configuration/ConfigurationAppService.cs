using Abp.Authorization;
using Abp.Runtime.Session;
using Office_Project.Configuration.Dto;
using System.Threading.Tasks;

namespace Office_Project.Configuration;

[AbpAuthorize]
public class ConfigurationAppService : Office_ProjectAppServiceBase, IConfigurationAppService
{
    public async Task ChangeUiTheme(ChangeUiThemeInput input)
    {
        await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
    }
}
