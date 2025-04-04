import Review from "../models/review.model.js";

export const updateHelpfulVotes = async (reviewId, userIds) => {
    try {
        await Review.updateOne(
            { _id: reviewId },
            {
                $inc: { helpfulCount: userIds.length },
                $addToSet: { helpfulUsers: userIds }
            }
        );
    } catch (err) {
        console.error("Error updating helpful votes:", err);
    }
};
