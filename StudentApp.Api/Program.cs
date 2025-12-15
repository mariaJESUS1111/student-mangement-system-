using Microsoft.EntityFrameworkCore;
using StudentApp.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// 1️⃣ Add services to the container
builder.Services.AddControllers();

// 2️⃣ Configure CORS for Angular frontend
var allowedOrigins = builder.Configuration["AllowedOrigins"]?.Split(',') ?? new[] { "http://localhost:4200" };
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


// 3️⃣ Configure Database - PostgreSQL for Railway, SQL Server for local
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<StudentContext>(options =>
{
    if (!string.IsNullOrEmpty(connectionString) && connectionString.Contains("Host="))
    {
        // PostgreSQL (Railway)
        options.UseNpgsql(connectionString);
    }
    else if (!string.IsNullOrEmpty(connectionString))
    {
        // SQL Server (Local)
        options.UseSqlServer(connectionString);
    }
    else
    {
        // Fallback to in-memory for testing
        options.UseInMemoryDatabase("StudentDb");
    }
});

// 4️⃣ Swagger (optional, for testing API)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 5️⃣ Auto-migrate database on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<StudentContext>();
    try
    {
        db.Database.Migrate();
    }
    catch
    {
        // If migrations fail, ensure database is created
        db.Database.EnsureCreated();
    }
}

// 6️⃣ Middleware
app.UseSwagger();
app.UseSwaggerUI();

// ✅ Enable CORS BEFORE authorization
app.UseCors("AllowAngularApp");

// Serve static files from wwwroot (for uploaded documents)
app.UseStaticFiles();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

