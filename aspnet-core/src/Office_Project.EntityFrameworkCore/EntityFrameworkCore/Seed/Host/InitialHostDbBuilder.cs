namespace Office_Project.EntityFrameworkCore.Seed.Host;

public class InitialHostDbBuilder
{
    private readonly Office_ProjectDbContext _context;

    public InitialHostDbBuilder(Office_ProjectDbContext context)
    {
        _context = context;
    }

    public void Create()
    {
        new DefaultEditionCreator(_context).Create();
        new DefaultLanguagesCreator(_context).Create();
        new HostRoleAndUserCreator(_context).Create();
        new DefaultSettingsCreator(_context).Create();

        _context.SaveChanges();
    }
}
