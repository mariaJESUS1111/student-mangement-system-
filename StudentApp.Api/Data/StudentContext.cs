using Microsoft.EntityFrameworkCore;
using StudentApp.Api.Models;

namespace StudentApp.Api.Data
{
    public class StudentContext : DbContext
    {
        public StudentContext(DbContextOptions<StudentContext> options) : base(options)
        {
        }

        public DbSet<Student> Students { get; set; } // This tells EF Core about the Students table
    }
}
