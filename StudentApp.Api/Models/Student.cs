namespace StudentApp.Api.Models
{
    public class Student
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? NationalId { get; set; }
        public DateTime Birthdate { get; set; }
        public string? Address { get; set; }
        public string? ScannedDocument { get; set; }
        public string? City { get; set; }
        public string? Class { get; set; }
        public string? Gender { get; set; }
        public bool Enrolled { get; set; }
        public string? Remarks { get; set; }
    }
}
