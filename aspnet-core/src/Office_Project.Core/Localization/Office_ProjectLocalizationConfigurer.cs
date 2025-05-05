using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace Office_Project.Localization;

public static class Office_ProjectLocalizationConfigurer
{
    public static void Configure(ILocalizationConfiguration localizationConfiguration)
    {
        localizationConfiguration.Sources.Add(
            new DictionaryBasedLocalizationSource(Office_ProjectConsts.LocalizationSourceName,
                new XmlEmbeddedFileLocalizationDictionaryProvider(
                    typeof(Office_ProjectLocalizationConfigurer).GetAssembly(),
                    "Office_Project.Localization.SourceFiles"
                )
            )
        );
    }
}
