const express = require('express')

const { loginUser, signupUser,getUser } = require('../controllers/userController')

const router = express.Router()

router.post('/login', loginUser)
router.post('/signup', signupUser)
router.get('/:userId',getUser)

module.exports = router