const path = require("path")
const express = require("express")
require("dotenv").config()

const authRoutes = require("./routes/authRoutes")

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, "../frontend")))

app.use("/auth", authRoutes)

app.listen(8081, () => {
    console.log("Server running on port 8081")
})