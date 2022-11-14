// Import express instance as app
const app = require("./app");

// The port express will use (port number from environment variable OR 3000)
const port = process.env.PORT || 3000

// Start app & listen
app.listen(port, () => {
    console.log(`Seán Óg's Fruity Steam API is live (^.^)\nListening at: ${port}`)
})