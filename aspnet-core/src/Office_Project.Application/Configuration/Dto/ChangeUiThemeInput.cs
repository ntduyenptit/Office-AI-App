using System.ComponentModel.DataAnnotations;

namespace Office_Project.Configuration.Dto;

public class ChangeUiThemeInput
{
    [Required]
    [StringLength(32)]
    public string Theme { get; set; }
}
