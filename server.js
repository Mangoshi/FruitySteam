// Separating the Express app from the 
const app = require("./app");

// the port express will use (port number from environment variable OR 3000)
const port = process.env.PORT || 3000

//  Listening  //
app.listen(port, () => {
    console.log(`Seán Óg's Fruity Steam API is live (^.^)\nListening at: ${port}`)
})