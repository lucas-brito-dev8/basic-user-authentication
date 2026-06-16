const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const pool = require("../config/db")

const SECRET = process.env.JWT_SECRET

async function register(req, res) {
    try {
        const { email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        const existing = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        )

        if (existing.rows.length > 0) {
            return res.status(401).send("Email is already registered.")
        }

        const result = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hashedPassword]
        )

        const user = result.rows[0]

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
            expiresIn: "7d",
        })

        res.json({ message: "User created!", token })
    } catch (e) {
        console.error(e)
        return res.status(500).send("Internal server error")
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        )

        if (result.rows.length === 0) {
            return res.status(401).send("User not found.")
        }

        const user = result.rows[0]
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(401).send("Incorrect password.")
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
            expiresIn: "7d",
        })

        res.json({ message: "Welcome back!", token })
    } catch (e) {
        console.error(e)
        return res.status(500).send("Internal server error.")
    }
}

function profile(req, res) {
    res.json({ id: req.user.id, email: req.user.email })
}

module.exports = { register, login, profile }