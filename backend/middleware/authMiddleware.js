const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// A function for protecting private routes.
const protect = asyncHandler(async (req, res, next) => {
    // Initialize token variable.
    let token

    // Check proper token has been sent.
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header, split 'Bearer' from token in array and grab the token portion.
            token = req.headers.authorization.split(' ')[1]

            // Verify token.
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user from token.
            req.user = await User.findById(decoded.id).select('-password')

            // Calls next piece of middleware.
            next()

        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized')
        }
    }

    if(!token) {
        res.status(401)
        throw new Error('Not authorized')
    }
})

module.exports = { protect }