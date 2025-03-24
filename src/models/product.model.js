import mongoose from 'mongoose';

// Available slot schema (for availability of the product)
const bookedSlotSchema = new mongoose.Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});

// Product schema
const productSchema = new mongoose.Schema(
    {
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to Users collection
        title: { type: String, required: true, minlength: 3 },
        description: { type: String, required: true, minlength: 10 },
        category: { type: String, required: true },
        pricePerDay: { type: Number, required: true, min: 0 },
        pricePerWeek: { type: Number, required: true, min: 0 },
        pricePerMonth: { type: Number, required: true, min: 0 },
        address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
        rules: { type: String, required: true },
        bookedSlots: [bookedSlotSchema],
        securityDeposit: { type: Number, required: true, min: 0, default: 0 },
        images: { type: [String], required: true },
        buyDate: { type: Date, required: true },
        isAvailable: { type: Boolean, default: true },
        ratings: { type: Number, min: 0, max: 5, default: 0 },
        isAgreed: { type: Boolean, default: false },
    },
    {
        timestamps: true, // This will automatically add createdAt and updatedAt fields
    }
);

// Create and export the model for Product
const Product = mongoose.model('Product', productSchema);

export default Product;
