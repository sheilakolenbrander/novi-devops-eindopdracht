using Microsoft.AspNetCore.Mvc;
using novi_devops_eindopdracht.Server.Models;
using novi_devops_eindopdracht.Server.Services;

namespace novi_devops_eindopdracht.Server.Controllers
{
    [ApiController]
    [Route("api/books")]
    public class BooksController : ControllerBase
    {
        private readonly BookService _service;

        public BooksController(BookService service)
        {
            _service = service;
        }

        [HttpGet]
        public ActionResult<List<Book>> GetAll()
        {
            var books = _service.GetAll();
            return Ok(books);
        }

        [HttpGet("{id}")]
        public ActionResult<Book> GetById(int id)
        {
            var book = _service.GetById(id);
            if (book == null) return NotFound();
            return Ok(book);
        }

        [HttpGet("status/{status}")]
        public ActionResult<List<Book>> GetByStatus(BookStatus status)
        {
            var books = _service.GetByStatus(status);
            return Ok(books);
        }

        [HttpPost]
        public ActionResult<Book> Add(Book book)
        {
            var newBook = _service.Add(book);
            return Ok(newBook);
        }

        [HttpPut("{id}/status")]
        public IActionResult UpdateStatus(int id, BookStatus status)
        {
            _service.UpdateStatus(id, status);
            return Ok();
        }
    }
}
