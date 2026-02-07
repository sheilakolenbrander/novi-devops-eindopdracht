using novi_devops_eindopdracht.Server.Models;

namespace novi_devops_eindopdracht.Server.Services
{
    public class BookService
    {
        private readonly List<Book> _books = new();

        public List<Book> GetAll()
        {
            return _books;
        }

        public Book? GetById(int id)
        {
            return _books.FirstOrDefault(b => b.Id == id);
        }

        public List<Book> GetByStatus(BookStatus status)
        {
            var bookList = _books.Where(b => b.Status == status).ToList();
            return bookList;
        }

        public Book Add(Book book)
        {
            book.Id = _books.Count + 1;
            _books.Add(book);
            return book;
        }

        public void UpdateStatus(int id, BookStatus status)
        {
            var book = GetById(id);
            if (book != null)
                book.Status = status;
        }
    }
}
