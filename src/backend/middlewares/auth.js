const jwt = require("jsonwebtoken")

const SECRET = process.env.JWT_SECRET

function verifyToken(req, res, next) {
    try {
        const headersAuth = req.headers.authorization

        if (!headersAuth) {
            return res.status(401).send("Token not provided")
        }

        const token = headersAuth.split(" ")[1]
        const decoded = jwt.verify(token, SECRET)

        req.user = decoded
        next()
    } catch (e) {
        return res.status(401).send("Invalid token.")
    }
}

module.exports = { verifyToken }