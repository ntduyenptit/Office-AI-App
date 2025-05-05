using Office_Project.Models.TokenAuth;
using Office_Project.Web.Controllers;
using Shouldly;
using System.Threading.Tasks;
using Xunit;

namespace Office_Project.Web.Tests.Controllers;

public class HomeController_Tests : Office_ProjectWebTestBase
{
    [Fact]
    public async Task Index_Test()
    {
        await AuthenticateAsync(null, new AuthenticateModel
        {
            UserNameOrEmailAddress = "admin",
            Password = "123qwe"
        });

        //Act
        var response = await GetResponseAsStringAsync(
            GetUrl<HomeController>(nameof(HomeController.Index))
        );

        //Assert
        response.ShouldNotBeNullOrEmpty();
    }
}