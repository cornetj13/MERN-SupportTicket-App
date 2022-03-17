const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

// @desc    Register a new user
// @route   /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {

    // Deconstructer the variables sent via POST requests.
    const { name, email, password } = req.body

    // Validation.
    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Please include all fields.')
    }

    // Find if user already exisits.
    const userExists = await User.findOne({email})

    // Throw error if user exists.
    if(userExists) {
        res.status(400)
        throw new Error('User alreayd exists')
    }

    // Hash password.
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user.
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    // Confirm user creation and sending json data, otherwise throw error.
    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Login a user
// @route   /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {

    // Deconstructer the variables sent via POST requests.
    const { email, password } = req.body

    // Find user in database.
    const user = await User.findOne({})

    // Confirm user exists and has provided correct password.
    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// Generate token function
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '120d'
    })
}

// @desc    Get current user
// @route   /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email

    }
    res.status(200).json(user)
})

module.exports = {
    registerUser,
    loginUser,
    getMe
}