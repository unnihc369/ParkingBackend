const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.login(email, password)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({ email, userid: user._id, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// signup a user
const signupUser = async (req, res) => {
  const { email, password, address, phoneNumber, username } = req.body

  try {
    const user = await User.signup(email, password, address, phoneNumber, username)

    // create a token
    const token = createToken(user._id)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "unnihc369@gmail.com",
        pass: "jgcl qrhg bcpz trzb",
      },
    });

    const mailOptions = {
      from: "unnihc369@gmail.com",
      to: user.email,
      subject: "Welcome to Parking Service!",
      text: `Dear ${user.username},

    Thank you for registering with our Parking Service! Your account has been successfully created.

    Login Details:
    - Username: ${user.username}
    - Email: ${user.email}

    You can now log in to manage your vehicle details, explore parking locations, and reserve parking slots.

    Get Started: [Login Page URL]

    For any assistance, contact our support team at [Support Email].

    Welcome aboard!

    Best regards,
    Parking Service Team
    `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ email, userid: user._id, token })

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getUser = async (req, res) => {
  const { userId } = req.params;
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

module.exports = { signupUser, loginUser, getUser }