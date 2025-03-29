import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        rent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Request',
            required: true
        },
        review: {
            type: String
        },
        rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            required: true,
        },
        helpfulCount: {
            type: Number,
            default: 0
        },
        helpfulUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: []
            }
        ],
        isEdited: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;