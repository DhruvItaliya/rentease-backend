import express from 'express';
import Dispute from '../../models/dispute.model.js';
import Message from '../../models/message.model.js';
const router = express.Router();

// Get all disputes
router.get('/', async (req, res) => {
    try {
        const disputes = await Dispute.find()
            .populate({
                path: 'rental',
                populate: [
                    { path: 'product' },
                    { path: 'borrower' }
                ]
            })
            .sort({ updatedAt: -1 });
        res.json(disputes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get messages for a dispute
router.get('/:rentalId/messages', async (req, res) => {
    try {
        const rentalId = req.params.rentalId;
        const dispute = await Dispute.findOne({ rental: rentalId }).lean();
        if (!dispute) await Dispute.create({ rental: rentalId })
        const messages = await Message.find({ rentalId: rentalId })
            .sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Send a message
router.post('/:rentalId/messages', async (req, res) => {
    try {
        const message = new Message({
            rentalId: req.params.rentalId,
            content: req.body.content,
            type: req.body.type,
            timestamp: new Date()
        });
        console.log(message)
        await message.save();

        // Get the io instance
        const io = req.app.get('io');

        // Emit the message to all clients in the dispute room
        io.to(req.params.rentalId).emit('newMessage', message);

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update dispute status
router.patch('/:rentalId/status', async (req, res) => {
    try {
        const dispute = await Dispute.findByIdAndUpdate(
            req.params.rentalId,
            { status: req.body.status },
            { new: true }
        );

        // Emit status update to all clients in the dispute room
        const io = req.app.get('io');
        io.to(req.params.rentalId).emit('statusUpdate', {
            rentalId: req.params.rentalId,
            status: req.body.status
        });

        res.json(dispute);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router; 