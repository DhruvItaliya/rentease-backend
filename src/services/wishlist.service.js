import User from "../models/user.model.js";

export const updateWishlist = async (userId, productIds) => {
    try {
        await User.updateOne(
            { _id: userId },
            { $addToSet: { wishlist: productIds } }
        );
    } catch (err) {
        console.error("Error updating wishlist:", err);
    }
};
