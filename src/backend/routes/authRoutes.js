const express = require("express")
const router = express.Router()
const { register, login, profile } = require("../controllers/authController")
const { verifyToken } = require("../middlewares/auth")

router.post("/register", register)
router.post("/login", login)
router.get("/profile", verifyToken, profile)

module.exports = router