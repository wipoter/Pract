using BirthdayWebApi.Classes;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options => options.AddPolicy(name: "BirthdayFront", policy =>
{
    policy.WithOrigins("http://localhost:4200",  
        "http://localhost:7242", 
        "http://127.0.0.1:4040",
        "https://7bed-193-56-148-91.ngrok-free.app").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
}));

//Connection to DB
builder.Services.AddDbContext<DataContext>(opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("BirthdayFront");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
