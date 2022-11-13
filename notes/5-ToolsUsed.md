
##### [[ Back: Unit Testing ]](4-UnitTesting.md)

<hr>

### [JSON-to-Mongoose Tool](https://transform.tools/json-to-mongoose)

Due to the fact that each game from the Steam dataset was massive, containing up to 39 fields, I resorted to using an online tool to generate the schema for me, based off a sample of the dataset in JSON format. This didn't give me the perfect format by any means, but it provided a good starting point. By using find & replace I was able to fix it fairly quickly and start defining rules such as required and unique.

<hr>

### [Mongo Shell (mongosh)](https://www.mongodb.com/try/download/shell)

1. Renaming the collection once data was present: 

```bash
db.originalCollectionName.renameCollection('newCollectionName')
```

This was because the collection names needed to match the schema mongoose was given.


2. Applying "unique" to more fields in the dataset (User: email, Game: AppID)

```bash
db.games.ensureIndex({AppID: 1}, {unique: true, dropDups: true})
```

This was needed because simply adding ``unique: true`` to the schema doesn't work if there are already duplicates in the database. The best approach is to drop a database and start with the correct schema, but if you can't do that for whatever reason, you can drop the duplicates while defining a new unique property by using this line with mongosh.

<hr>

##### [[ End: Back To Index ]](0-Index.md)

