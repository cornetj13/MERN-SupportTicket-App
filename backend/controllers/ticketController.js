const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const Ticket = require('../models/ticketModel')

// @desc    Get user tickets
// @route   GET /api/tickets
// @access  Private
const getTickets = asyncHandler(async (req, res) => {
    // Get user using the ID in the JWT
    const user = await User.findById(req.user.id)

    // Check user exists in database.
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Find tickets for said user.
    const tickets = await Ticket.find({user: req.user.id})

    // Send tickets and success status.
    res.status(200).json(tickets)
})

// @desc    Get user ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = asyncHandler(async (req, res) => {
    // Get user using the ID in the JWT
    const user = await User.findById(req.user.id)

    // Check user exists in database.
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Find tickets for said user.
    const ticket = await Ticket.findById(req.params.id)

    // Check ticket exists in database.
    if(!ticket) {
        res.status(404)
        throw new Error('Ticket not found.')
    }

    // Check ticket was submitted by user.
    if(ticket.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    // Send tickets and success status.
    res.status(200).json(ticket)
})

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
    const { product, description } = req.body

    // Check that ticket is properly filled.
    if(!product || !description) {
        res.status(400)
        throw new Error('Please add a product and a description')
    }

    // Get user using the ID in the JWT
    const user = await User.findById(req.user.id)

    // Check user exists in database.
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Create the ticket.
    const ticket = await Ticket.create({
        product,
        description,
        user: req.user.id,
        status: 'new'
    })

    // Create ticket and successfully created status.
    res.status(201).json(ticket)
})

// @desc    Delete user ticket
// @route   DELETE /api/tickets/:id
// @access  Private
const deleteTicket = asyncHandler(async (req, res) => {
    // Get user using the ID in the JWT
    const user = await User.findById(req.user.id)

    // Check user exists in database.
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Find tickets for said user.
    const ticket = await Ticket.findById(req.params.id)

    // Check ticket exists in database.
    if(!ticket) {
        res.status(404)
        throw new Error('Ticket not found.')
    }

    // Check ticket was submitted by user.
    if(ticket.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    // Delete ticket.
    await ticket.remove()

    // Send success status.
    res.status(200).json({success: true})
})

// @desc    Update user ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = asyncHandler(async (req, res) => {
    // Get user using the ID in the JWT
    const user = await User.findById(req.user.id)

    // Check user exists in database.
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Find tickets for said user.
    const ticket = await Ticket.findById(req.params.id)

    // Check ticket exists in database.
    if(!ticket) {
        res.status(404)
        throw new Error('Ticket not found.')
    }

    // Check ticket was submitted by user.
    if(ticket.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    // Update ticket.
    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true })

    // Send updated tickets and success status.
    res.status(200).json(updatedTicket)
})


module.exports = {
    getTickets,
    getTicket,
    createTicket,
    deleteTicket,
    updateTicket
}