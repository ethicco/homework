```
db.books.insertMany([
  {
    title: "Преступление и наказание",
    description: "",
    authors: "Фёдор Достоевский",
  },
  {
    title: "Война и мир",
    description: "",
    authors: "Лев Толстой",
  }
]);

db.books.find({ title: "Мастер и Маргарита" })

db.books.updateOne(
  { \_id: ObjectId("64bcd1234a56789ef0123456") },
  {
    $set: {
      description: "Обновлённое описание книги",
      authors: "Автор 1",
    }
  }
)
```
