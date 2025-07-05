import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema({
    rental: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'resolved'],
        default: 'open'
    }
}, { timestamps: true });

const Dispute = mongoose.model('Dispute', disputeSchema);
export default Dispute;