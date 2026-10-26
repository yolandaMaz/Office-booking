const app = require("./app")

app.listen(3000, function (error) {
    if (error) {
        console.log("Could not start. Is another server already running?" + error.message)
        return
    }
    console.log("Server is running on http://localhost:3000")
})
