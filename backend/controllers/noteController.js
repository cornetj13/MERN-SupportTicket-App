const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const Note = require('../models/noteModel')
const Ticket = require('../models/ticketModel')

// @desc    Get notes for specific user ticket
// @route   GET /api/tickets/:ticketId/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
    // Get user using the ID in the JWT
    const user = await User.findById(req.user.id)

    // Check user exists in database.
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Find tickets for said user.
    const ticket = await Ticket.findById(req.params.ticketId)

    // Check user is authorized to add notes to ticket.
    if(ticket.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    // Find notes on ticket.
    const notes = await Note.find({ticket: req.params.ticketId})

    // Send notes on ticket and success status.
    res.status(200).json(notes)
})

// @desc    Create ticket note for specific user ticket
// @route   POST /api/tickets/:ticketId/notes
// @access  Private
const addNote = asyncHandler(async (req, res) => {
    // Get user using the ID in the JWT
    const user = await User.findById(req.user.id)

    // Check user exists in database.
    if(!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Find tickets for said user.
    const ticket = await Ticket.findById(req.params.ticketId)

    // Check user is authorized to add notes to ticket.
    if(ticket.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    // Add note on ticket.
    const note = await Note.create({
        text: req.body.text,
        isStaff: false,
        ticket: req.params.ticketId,
        user: req.user.id
    })

    // Send notes on ticket and success status.
    res.status(200).json(note)
})

module.exports = {
    getNotes,
    addNote
}