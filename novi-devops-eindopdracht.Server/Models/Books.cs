namespace novi_devops_eindopdracht.Server.Models
{
    public enum BookStatus
    {
        ToRead,
        Reading,
        Read
    }

    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Author { get; set; } = "";
        public BookStatus Status { get; set; }
    }
}
