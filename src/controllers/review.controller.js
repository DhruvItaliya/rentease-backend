import { asyncErrorHandler, sendError, sendSuccess } from "../services/common.service.js";
import { isValidObjectId } from "mongoose";
import Review from "../models/review.model.js";

export const getReivews = asyncErrorHandler(async (req, res, next) => {
    const userId = req.userDetails._id;
    const { productId } = req.query;
    console.log(productId)
    if (!isValidObjectId(productId)) {
        return sendError(next, "Product Not Found!", 400);
    }
    const reviews = await Review.find({ user: userId, product: productId }).populate('user', 'name');
    return sendSuccess(res, reviews, 200);
})

export const addReivew = asyncErrorHandler(async (req, res, next) => {
    const userId = req.userDetails._id;
    const { review, rating, productId, rentId } = req.body.payload;
    if (!isValidObjectId(productId) || !isValidObjectId(rentId)) {
        return sendError(next, 'Product Not Found!', 400)
    }
    await Review.create({ user: userId, product: productId, rent: rentId, review, rating })
    return sendSuccess(res, "review added successfully", 201);
})

export const addHelpfulVotes = asyncErrorHandler(async (req, res, next) => {
    const { reviewId } = req.params;
    const userId = req.userDetails._id;
    if (!isValidObjectId(reviewId)) {
        return sendError(next, 'Review Not Found!', 400);
    }
    const review = await Review.findOne({ _id: reviewId }).populate('user', 'name');
    review.helpfulUsers.push(userId);
    review.helpfulCount++;
    await review.save();
    return sendSuccess(res, review, 200)
})