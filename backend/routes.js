const path = require("path")
const pool = require("./db.js")
const bycript = require("bcrypt")
const express = require("express")
const jwt = require("jsonwebtoken")
const env = require("dotenv").config()

const app = express()

app.use(express.static(path.join(__dirname, "../frontend")))

const SECRET = process.env.JWT_SECRET

app.use(express.json())

app.post('/auth/register', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const hashedPassword = await bycript.hash(password, 10)

        const isThereEmail = await pool.query("SELECT * FROM users WHERE email = $1",
            [email]
        )

        if (isThereEmail.rows.length > 0) {
            return res.status(401).send("Email already exists.")
        }

        const createdUser = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hashedPassword]
        )

        const user = createdUser.rows[0]

        const sendToken = jwt.sign({
            id: user.id,
            email: user.email
        }, SECRET, {
            expiresIn: "7d"
        })

        res.json({
            message: 'User created!',
            token: sendToken
        })
    } catch (e) {
        console.log(e)
        return res.status(500).send('Internal server error.')
    }
})

app.get('/profile', async (req, res) => {
    try {
        const headersAuth = req.headers.authorization
        const token = headersAuth.split(" ")[1]

        const decoded = jwt.verify(token, SECRET)

        res.json({
            id: decoded.id,
            email: decoded.email
        })
    } catch (e) {
        return res.status(500).send('Internal server error.')
    }
})

app.post('/auth/login', async (req, res) => {
    try {
        const userEmail = req.body.email
        const reqPassword = req.body.password
        const user = await pool.query("SELECT * FROM users WHERE email = $1",
            [userEmail]
        )
        const userFound = user.rows[0]

        if (user.rows.length === 0) {
            return res.status(401).send("User not found.")
        }

        const checkPassword = await bycript.compare(reqPassword, userFound.password)

        if (!checkPassword) {
            return res.status(401).send("Incorrect password.")
        }

        const token = jwt.sign({
            id: userFound.id,
            email: userFound.email
        }, SECRET, {
            expiresIn: "7d"
        })

        res.json({
            message: "Welcome back!",
            token: token
        })
    } catch (e) {
        return res.status(500).send('Internal server error.')
    }
})

app.listen(8081, () => {
    console.log("Server running on port 8081")
})