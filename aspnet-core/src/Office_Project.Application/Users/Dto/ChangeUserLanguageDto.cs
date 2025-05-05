using System.ComponentModel.DataAnnotations;

namespace Office_Project.Users.Dto;

public class ChangeUserLanguageDto
{
    [Required]
    public string LanguageName { get; set; }
}