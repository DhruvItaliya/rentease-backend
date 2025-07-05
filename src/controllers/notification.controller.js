import Notification from "../models/notification.model.js";
import { asyncErrorHandler } from "../services/common.service.js";
import sendMail from "../services/email.service.js";
import CustomError from "../utils/customError.js";

export const addProductNotification = asyncErrorHandler(async (req, res, next) => {
    const { productId } = req.body;
    const userId = req.userDetails._id
    const existing = await Notification.findOne({ productId, userId });
    if (existing) {
        await Notification.deleteOne({ productId, userId })
        return res.status(200).json({ data: "removed" });
    };

    const notification = new Notification({ productId, userId });
    await notification.save();

    return res.status(201).json({ data: 'added' });
});

export const notifyUsers = asyncErrorHandler(async (productId) => {
    const notifications = await Notification.find({ productId, notified: false }).populate('userId');
    if (!notifications.length) return;

    for (const notify of notifications) {
        const user = notify.userId;

        // Call your notification method
        await sendMail({ to: user.email, subject: `Product is now available`, html: `The product you're waiting for is back in stock!` });

        notify.notified = true;
        await notify.save();
    }

    // Optionally: Delete notifications
    // await Notification.deleteMany({ productId });
})

export const getProductNotification = asyncErrorHandler(async (req, res, next) => {
    const userId = req.userDetails._id
    const existing = await Notification.find({ userId }).select('productId');
    const productIds = existing.map(product => product.productId)
    res.status(200).json({ data: productIds });
});