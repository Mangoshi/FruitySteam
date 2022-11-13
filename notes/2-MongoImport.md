
##### [[ Back: Dataset Selection ]](1-DatasetSelection.md)

<hr>

To manually import a CSV or JSON file into a MongoDB database, one needs to have their [command line database tools](https://www.mongodb.com/try/download/database-tools) installed. 

This allows you to run commands such as:

JSON
```bash
mongoimport --uri mongodb+srv://Username:Password@cluster.bhpmyak.mongodb.net/Steam --collection DB --type json --file .\steam_data.json
```
(Can optionally include --jsonArray to tell Mongo that it's a JSON file with an array of Objects)

CSV
```bash
mongoimport --uri mongodb+srv://Username:Password@cluster.bhpmyak.mongodb.net/Steam --collection DB --type csv --file .\steam_data.csv
```
(Can optionally include --headerline to tell Mongo to treat the first row as column headers)

I already tried to use these with the 27k games dataset, even tried using a for-loop to try to brute-force the importation of multiple CSV files at once.

```bash
$files = Get-ChildItem .
foreach ($f in $files) {
  if ($f -Like "*.csv") {
    mongoimport --uri mongodb+srv://Username:Password@cluster.bhpmyak.mongodb.net/Datasets -c Steam27k --type csv --file $f --headerline
  }
}
```

Since I felt it would suit Mongo better, I started off trying to use the JSON file from the 64k dataset,  probably due to my horrible experience trying to merge the 27k CSV files!

However, a problem presented itself pretty quickly. It was confusing at first because it was difficult to even view the JSON file, my text editors, even the lightest and most performant of them (Notepad++), would all stall my computer upon trying to open the file.

This was hardly surprising though, considering the file was 400MB and had almost 6 million lines in it, a whopping 409.6 million characters!

When I eventually managed to open the file, I noticed it was in the wrong format:

```json
"root": {
	"1" : {
		"name" : "First Game"
	},
	"2" : {
		"name" : "Game Name"
	},
}
```

Because of this, the MongoDB import statement was treating the entire file as one **massive** game.

It was trying to add nearly 64,000 games to a single entry in my database's game collection! This exceeded Mongo's size limit for an individual item, so it would fail to execute the command.

To attempt to fix this, I copied a few games out into a JSON validator (CTRL+A not possible..) and played around to see if I could programmatically add each of these Objects into a JSON array of objects. However, I couldn't find a way to do this, especially with such a large file.

So it was time to try the CSV file, and I wish I had to begin with, because it worked first try.

Command used:
```bash
mongoimport --uri mongodb+srv://Username:Password@cluster.bhpmyak.mongodb.net/Datasets --collection Steam64k --type csv --file .\games.csv
```

I now had a database hosted on MongoDB called 'Datasets' containing a collection called 'Steam64k' containing almost 64,000 games data cleanly scraped from the Steam Store.

At some stage I imported it again, and it exceeded the collection size limit on the MongoDB free-tier (500MB)..

<hr>

##### [[ Next: Development ]](3-Development.md)
