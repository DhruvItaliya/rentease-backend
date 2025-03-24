import mongoose from 'mongoose';

// Available slot schema (for availability of the product)
const availableSlotSchema = new mongoose.Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['available', 'booked'], default: 'available' }
});

// Product schema
const requestSchema = new mongoose.Schema(
    {
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        dateRange: {
            startDate: { type: Date, required: true },
            endDate: { type: Date, required: true },
        },
        total: { type: Number, required: true, default: 0 },
        isDeleted: { type: Boolean, default: false },
        status: { type: String, enum: ['pending', 'approved', 'rejected', 'done', 'returned'], default: 'pending' },
        numberOfDays: { type: Number, required: true, default: 0 },
        priceApplied: { type: Number, required: true, default: 0 },
    },
    {
        timestamps: true,
    }
);

const Request = mongoose.model('Request', requestSchema);

export default Request;
