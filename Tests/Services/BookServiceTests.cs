namespace Tests.Services
{
    using novi_devops_eindopdracht.Server.Models;
    using novi_devops_eindopdracht.Server.Services;
    using Xunit;

    public class BookServiceTests
    {
        [Fact]
        public void Add_Should_Add_Book()
        {
            // Arrange
            var service = new BookService();
            var book = new Book
            {
                Title = "1984",
                Author = "Orwell",
                Status = BookStatus.ToRead
            };

            // Act
            var result = service.Add(book);

            // Assert
            Assert.Equal("1984", result.Title);
            Assert.Equal("Orwell", result.Author);
            Assert.Equal(BookStatus.ToRead, result.Status);
            Assert.Equal(1, result.Id); // Eerste boek krijgt ID 1
        }

        [Fact]
        public void Add_Should_Increment_Id()
        {
            // Arrange
            var service = new BookService();
            var book1 = new Book { Title = "Book 1", Author = "Author 1", Status = BookStatus.ToRead };
            var book2 = new Book { Title = "Book 2", Author = "Author 2", Status = BookStatus.Reading };

            // Act
            var result1 = service.Add(book1);
            var result2 = service.Add(book2);

            // Assert
            Assert.Equal(1, result1.Id);
            Assert.Equal(2, result2.Id);
        }

        [Fact]
        public void GetAll_Should_Return_Empty_List_Initially()
        {
            // Arrange
            var service = new BookService();

            // Act
            var result = service.GetAll();

            // Assert
            Assert.Empty(result);
        }

        [Fact]
        public void GetAll_Should_Return_All_Books()
        {
            // Arrange
            var service = new BookService();
            service.Add(new Book { Title = "Book 1", Author = "Author 1", Status = BookStatus.ToRead });
            service.Add(new Book { Title = "Book 2", Author = "Author 2", Status = BookStatus.Reading });
            service.Add(new Book { Title = "Book 3", Author = "Author 3", Status = BookStatus.Read });

            // Act
            var result = service.GetAll();

            // Assert
            Assert.Equal(3, result.Count);
        }

        [Fact]
        public void GetById_Should_Return_Correct_Book()
        {
            // Arrange
            var service = new BookService();
            var book = service.Add(new Book { Title = "1984", Author = "Orwell", Status = BookStatus.ToRead });

            // Act
            var result = service.GetById(book.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("1984", result.Title);
            Assert.Equal("Orwell", result.Author);
        }

        [Fact]
        public void GetById_Should_Return_Null_For_NonExistent_Id()
        {
            // Arrange
            var service = new BookService();

            // Act
            var result = service.GetById(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void GetByStatus_Should_Return_Books_With_Matching_Status()
        {
            // Arrange
            var service = new BookService();
            service.Add(new Book { Title = "Book 1", Author = "Author 1", Status = BookStatus.ToRead });
            service.Add(new Book { Title = "Book 2", Author = "Author 2", Status = BookStatus.Reading });
            service.Add(new Book { Title = "Book 3", Author = "Author 3", Status = BookStatus.ToRead });

            // Act
            var result = service.GetByStatus(BookStatus.ToRead);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.All(result, book => Assert.Equal(BookStatus.ToRead, book.Status));
        }

        [Fact]
        public void GetByStatus_Should_Return_Empty_List_When_No_Matches()
        {
            // Arrange
            var service = new BookService();
            service.Add(new Book { Title = "Book 1", Author = "Author 1", Status = BookStatus.ToRead });

            // Act
            var result = service.GetByStatus(BookStatus.Read);

            // Assert
            Assert.Empty(result);
        }

        [Theory]
        [InlineData(BookStatus.ToRead)]
        [InlineData(BookStatus.Reading)]
        [InlineData(BookStatus.Read)]
        public void GetByStatus_Should_Work_For_All_Status_Values(BookStatus status)
        {
            // Arrange
            var service = new BookService();
            service.Add(new Book { Title = "Book", Author = "Author", Status = status });

            // Act
            var result = service.GetByStatus(status);

            // Assert
            Assert.Single(result);
            Assert.Equal(status, result[0].Status);
        }

        [Fact]
        public void UpdateStatus_Should_Change_Book_Status()
        {
            // Arrange
            var service = new BookService();
            var book = service.Add(new Book { Title = "1984", Author = "Orwell", Status = BookStatus.ToRead });

            // Act
            service.UpdateStatus(book.Id, BookStatus.Reading);

            // Assert
            var updatedBook = service.GetById(book.Id);
            Assert.NotNull(updatedBook);
            Assert.Equal(BookStatus.Reading, updatedBook.Status);
        }

        [Fact]
        public void UpdateStatus_Should_Not_Throw_For_NonExistent_Id()
        {
            // Arrange
            var service = new BookService();

            // Act & Assert - should not throw exception
            service.UpdateStatus(999, BookStatus.Reading);
        }

        [Fact]
        public void UpdateStatus_Should_Update_Multiple_Times()
        {
            // Arrange
            var service = new BookService();
            var book = service.Add(new Book { Title = "1984", Author = "Orwell", Status = BookStatus.ToRead });

            // Act
            service.UpdateStatus(book.Id, BookStatus.Reading);
            service.UpdateStatus(book.Id, BookStatus.Read);

            // Assert
            var updatedBook = service.GetById(book.Id);
            Assert.NotNull(updatedBook);
            Assert.Equal(BookStatus.Read, updatedBook.Status);
        }
    }
}