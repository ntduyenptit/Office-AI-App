using Office_Project.Debugging;

namespace Office_Project;

public class Office_ProjectConsts
{
    public const string LocalizationSourceName = "Office_Project";

    public const string ConnectionStringName = "Default";

    public const bool MultiTenancyEnabled = false;


    /// <summary>
    /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
    /// </summary>
    public static readonly string DefaultPassPhrase =
        DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "a92a32c7c6484feb9f2b5e85a013d74c";
}
