namespace Tests.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using novi_devops_eindopdracht.Server.Controllers;
    using novi_devops_eindopdracht.Server.Models;
    using novi_devops_eindopdracht.Server.Services;
    using Xunit;

    public class BooksControllerTests
    {
        private BooksController CreateController()
        {
            var service = new BookService();
            return new BooksController(service);
        }

        [Fact]
        public void GetAll_Should_Return_OkResult_With_Empty_List()
        {
            // Arrange
            var controller = CreateController();

            // Act
            var result = controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var books = Assert.IsType<List<Book>>(okResult.Value);
            Assert.Empty(books);
        }

        [Fact]
        public void GetAll_Should_Return_All_Books()
        {
            // Arrange
            var controller = CreateController();
            controller.Add(new Book { Title = "Book 1", Author = "Author 1", Status = BookStatus.ToRead });
            controller.Add(new Book { Title = "Book 2", Author = "Author 2", Status = BookStatus.Reading });

            // Act
            var result = controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var books = Assert.IsType<List<Book>>(okResult.Value);
            Assert.Equal(2, books.Count);
        }

        [Fact]
        public void GetById_Should_Return_OkResult_With_Book()
        {
            // Arrange
            var controller = CreateController();
            var addResult = controller.Add(new Book { Title = "1984", Author = "Orwell", Status = BookStatus.ToRead });
            var addedBook = (addResult.Result as OkObjectResult)?.Value as Book;

            // Act
            var result = controller.GetById(addedBook!.Id);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var book = Assert.IsType<Book>(okResult.Value);
            Assert.Equal("1984", book.Title);
            Assert.Equal("Orwell", book.Author);
        }

        [Fact]
        public void GetById_Should_Return_NotFound_For_NonExistent_Id()
        {
            // Arrange
            var controller = CreateController();

            // Act
            var result = controller.GetById(999);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public void GetByStatus_Should_Return_Books_With_Matching_Status()
        {
            // Arrange
            var controller = CreateController();
            controller.Add(new Book { Title = "Book 1", Author = "Author 1", Status = BookStatus.ToRead });
            controller.Add(new Book { Title = "Book 2", Author = "Author 2", Status = BookStatus.Reading });
            controller.Add(new Book { Title = "Book 3", Author = "Author 3", Status = BookStatus.ToRead });

            // Act
            var result = controller.GetByStatus(BookStatus.ToRead);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var books = Assert.IsType<List<Book>>(okResult.Value);
            Assert.Equal(2, books.Count);
            Assert.All(books, book => Assert.Equal(BookStatus.ToRead, book.Status));
        }

        [Fact]
        public void GetByStatus_Should_Return_Empty_List_When_No_Matches()
        {
            // Arrange
            var controller = CreateController();
            controller.Add(new Book { Title = "Book 1", Author = "Author 1", Status = BookStatus.ToRead });

            // Act
            var result = controller.GetByStatus(BookStatus.Read);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var books = Assert.IsType<List<Book>>(okResult.Value);
            Assert.Empty(books);
        }

        [Theory]
        [InlineData(BookStatus.ToRead)]
        [InlineData(BookStatus.Reading)]
        [InlineData(BookStatus.Read)]
        public void GetByStatus_Should_Work_For_All_Status_Values(BookStatus status)
        {
            // Arrange
            var controller = CreateController();
            controller.Add(new Book { Title = "Book", Author = "Author", Status = status });

            // Act
            var result = controller.GetByStatus(status);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var books = Assert.IsType<List<Book>>(okResult.Value);
            Assert.Single(books);
            Assert.Equal(status, books[0].Status);
        }

        [Fact]
        public void Add_Should_Return_OkResult_With_Added_Book()
        {
            // Arrange
            var controller = CreateController();
            var book = new Book { Title = "1984", Author = "Orwell", Status = BookStatus.ToRead };

            // Act
            var result = controller.Add(book);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var addedBook = Assert.IsType<Book>(okResult.Value);
            Assert.Equal("1984", addedBook.Title);
            Assert.Equal("Orwell", addedBook.Author);
            Assert.Equal(BookStatus.ToRead, addedBook.Status);
            Assert.True(addedBook.Id > 0);
        }

        [Fact]
        public void Add_Should_Assign_Unique_Ids()
        {
            // Arrange
            var controller = CreateController();
            var book1 = new Book { Title = "Book 1", Author = "Author 1", Status = BookStatus.ToRead };
            var book2 = new Book { Title = "Book 2", Author = "Author 2", Status = BookStatus.Reading };

            // Act
            var result1 = controller.Add(book1);
            var result2 = controller.Add(book2);

            // Assert
            var addedBook1 = (result1.Result as OkObjectResult)?.Value as Book;
            var addedBook2 = (result2.Result as OkObjectResult)?.Value as Book;

            Assert.NotNull(addedBook1);
            Assert.NotNull(addedBook2);
            Assert.NotEqual(addedBook1.Id, addedBook2.Id);
        }

        [Fact]
        public void UpdateStatus_Should_Return_OkResult()
        {
            // Arrange
            var controller = CreateController();
            var addResult = controller.Add(new Book { Title = "1984", Author = "Orwell", Status = BookStatus.ToRead });
            var addedBook = (addResult.Result as OkObjectResult)?.Value as Book;

            // Act
            var result = controller.UpdateStatus(addedBook!.Id, BookStatus.Reading);

            // Assert
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public void UpdateStatus_Should_Actually_Update_Book_Status()
        {
            // Arrange
            var controller = CreateController();
            var addResult = controller.Add(new Book { Title = "1984", Author = "Orwell", Status = BookStatus.ToRead });
            var addedBook = (addResult.Result as OkObjectResult)?.Value as Book;

            // Act
            controller.UpdateStatus(addedBook!.Id, BookStatus.Reading);

            // Assert
            var getResult = controller.GetById(addedBook.Id);
            var okResult = Assert.IsType<OkObjectResult>(getResult.Result);
            var updatedBook = Assert.IsType<Book>(okResult.Value);
            Assert.Equal(BookStatus.Reading, updatedBook.Status);
        }

        [Fact]
        public void UpdateStatus_Should_Allow_Multiple_Updates()
        {
            // Arrange
            var controller = CreateController();
            var addResult = controller.Add(new Book { Title = "1984", Author = "Orwell", Status = BookStatus.ToRead });
            var addedBook = (addResult.Result as OkObjectResult)?.Value as Book;

            // Act
            controller.UpdateStatus(addedBook!.Id, BookStatus.Reading);
            controller.UpdateStatus(addedBook.Id, BookStatus.Read);

            // Assert
            var getResult = controller.GetById(addedBook.Id);
            var okResult = Assert.IsType<OkObjectResult>(getResult.Result);
            var updatedBook = Assert.IsType<Book>(okResult.Value);
            Assert.Equal(BookStatus.Read, updatedBook.Status);
        }

        [Fact]
        public void UpdateStatus_Should_Return_Ok_For_NonExistent_Id()
        {
            // Arrange
            var controller = CreateController();

            // Act
            var result = controller.UpdateStatus(999, BookStatus.Reading);

            // Assert
            Assert.IsType<OkResult>(result);
        }
    }
}