const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true
  },
  phoneNumber: {
    type: String,
    unique: true
  },
  address: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

// Static method for signup
userSchema.statics.signup = async function (email, password,address,phoneNumber ,username ) {

  // Validation
  if (!email || !password || !username) {
    throw Error('All fields must be filled')
  }
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }
  if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
  }

  const emailExists = await this.findOne({ email })
  if (emailExists) {
    throw Error('Email already in use')
  }

  const usernameExists = await this.findOne({ username })
  if (usernameExists) {
    throw Error('Username already in use')
  }

  const phoneNumberExists = await this.findOne({ phoneNumber })
  if (phoneNumberExists) {
    throw Error('Phone number already in use')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  // Create user
  const user = await this.create({ email, password: hash, address, phoneNumber, username })

  return user
}

// Static method for login
userSchema.statics.login = async function (email, password) {

  // Validation
  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ email })
  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

module.exports = mongoose.model('User', userSchema)
