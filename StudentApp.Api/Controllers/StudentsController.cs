using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentApp.Api.Data;
using StudentApp.Api.Models;

namespace StudentApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly StudentContext _context;

        public StudentsController(StudentContext context)
        {
            _context = context;
        }

        // ✅ GET all students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetAll()
        {
            return await _context.Students.ToListAsync();
        }

        // ✅ GET student by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetById(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return NotFound();

            return student;
        }

        // ✅ POST - Add new student (with optional file upload)
        [HttpPost]
        public async Task<ActionResult<Student>> Create([FromForm] Student student, IFormFile? file)
        {
            // Ensure EF generates the Id automatically
            student.Id = 0;

            if (file != null && file.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                student.ScannedDocument = uniqueFileName;
            }

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = student.Id }, student);
        }

        // ✅ PUT - Update existing student (also supports file upload)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] Student updatedStudent, IFormFile? file)
        {
            if (id != updatedStudent.Id)
                return BadRequest();

            var existingStudent = await _context.Students.FindAsync(id);
            if (existingStudent == null)
                return NotFound();

            // Update basic fields
            existingStudent.Name = updatedStudent.Name;
            existingStudent.NationalId = updatedStudent.NationalId;
            existingStudent.Birthdate = updatedStudent.Birthdate;
            existingStudent.Address = updatedStudent.Address;
            existingStudent.City = updatedStudent.City;
            existingStudent.Class = updatedStudent.Class;
            existingStudent.Gender = updatedStudent.Gender;
            existingStudent.Enrolled = updatedStudent.Enrolled;
            existingStudent.Remarks = updatedStudent.Remarks;

            // Handle new file if uploaded
            if (file != null && file.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                existingStudent.ScannedDocument = uniqueFileName;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ DELETE - Delete student
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return NotFound();

            // Optionally delete the file if it exists
            if (!string.IsNullOrEmpty(student.ScannedDocument))
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", student.ScannedDocument);
                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ GET - Download student’s file
        [HttpGet("{id}/file")]
        public async Task<IActionResult> GetFile(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null || string.IsNullOrEmpty(student.ScannedDocument))
                return NotFound("No file found for this student.");

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", student.ScannedDocument);
            if (!System.IO.File.Exists(filePath))
                return NotFound("File not found on server.");

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            var contentType = "application/octet-stream";
            return File(fileBytes, contentType, student.ScannedDocument);
        }
    }
}
