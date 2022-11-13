
##### [Back: Index](0-Index.md)

<hr>

Tried ~3 Steam Games datasets from Kaggle (looked at ~6)

1. [First one](https://www.kaggle.com/datasets/deepann/80000-steam-games-dataset)
	1. ~80k games
	2. Tags and other arrays had no delimiter between words
2. [Second one](https://www.kaggle.com/datasets/nikdavis/steam-store-games)
	1. ~27k games
	2. Was split into multiple CSV files (ie. description data, tag data, requirements data)
		- Tried using command line methods of combining CSV files
		- Tried writing Python scripts and a Jupyter Notebook to merge them based on common cols
		- Main issue with latter was mismatched data types, making the merges fail
3. [Third one](https://www.kaggle.com/datasets/fronkongames/steam-games-dataset?select=games.json)
	1. 64k games
	2. Comma-seperated strings for array columns
	3. One CSV file, or one JSON file (mostly identical)

The third dataset I tried had all that was needed to work.

<hr>

##### [Next: Mongo Import](2-MongoImport.md)
