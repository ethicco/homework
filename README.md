````db.books.insertMany([
  {
    title: "Преступление и наказание",
    author: "Фёдор Достоевский",
    year: 1866,
    genre: "Роман"
  },
  {
    title: "Война и мир",
    author: "Лев Толстой",
    year: 1869,
    genre: "Эпос"
  }
]);```

```
db.books.find({ title: "Мастер и Маргарита" })
```

```
db.books.updateOne(
  { _id: ObjectId("64bcd1234a56789ef0123456") },
  {
    $set: {
      description: "Обновлённое описание книги",
      authors: ["Автор 1", "Автор 2"]
    }
  }
)
```
````
