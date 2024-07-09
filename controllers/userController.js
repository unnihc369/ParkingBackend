const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email,userid:user._id,token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
  const {email, password,address,phoneNumber,username} = req.body

  try {
    const user = await User.signup(email, password, address, phoneNumber, username)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({ email, userid: user._id, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const getUser = async (req,res)=>{
  const {userId} = req.params;
  try {
    const user = await User.findById(userId).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { signupUser, loginUser,getUser }