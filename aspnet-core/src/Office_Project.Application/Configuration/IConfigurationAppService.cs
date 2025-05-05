using Office_Project.Configuration.Dto;
using System.Threading.Tasks;

namespace Office_Project.Configuration;

public interface IConfigurationAppService
{
    Task ChangeUiTheme(ChangeUiThemeInput input);
}
