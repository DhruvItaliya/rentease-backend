import Agreement from "../models/agreement.model.js";
import Product from "../models/product.model.js";
import Request from "../models/request.model.js";
import { asyncErrorHandler } from "../services/common.service.js";
import { isValidObjectId } from "../utils/common.utils.js";
import CustomError from "../utils/customError.js";
import Stripe from 'stripe';
const stripe1 = new Stripe(process.env.STRIPE_KEY);
export const makeRequest = asyncErrorHandler(async (req, res, next) => {
    const { productId, startDate, endDate, } = req.body;

    const product = await Product.findOne({ _id: productId }).populate('owner');
    if (!product) {
        const error = new CustomError("Could not found product!", 400);
        next(error);
    }

    if (product.owner._id === req.userDetails._id) {
        const error = new CustomError("Owner can not be borrower", 400);
        next(error);
    }

    const dayDifference = ((new Date(endDate) - new Date(startDate)) / (1000 * 3600 * 24)) + 1;

    let totalAmount = 0;
    let priceApplied = 0;
    if (dayDifference < 7) {
        totalAmount = product.pricePerDay * dayDifference;
        priceApplied = product.pricePerDay;
    }
    else if (dayDifference < 30) {
        totalAmount = product.pricePerWeek * (dayDifference) / 7;
        priceApplied = product.pricePerWeek / 7;
    }
    else {
        totalAmount = product.pricePerMonth * (dayDifference) / 30;
        priceApplied = product.pricePerMonth / 30;
    }
    totalAmount += product.securityDeposit + 0.1 * product.pricePerDay; // added service charge
    const reqObj = {
        owner: product.owner._id,
        product: productId,
        borrower: req.userDetails._id,
        dateRange: {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        },
        numberOfDays: dayDifference,
        total: totalAmount,
        priceApplied: priceApplied
    }

    const request = await Request.create(reqObj);
    res.status(201).json({ data: "Request created succesfully!" });
})

export const approveRequest = asyncErrorHandler(async (req, res, next) => {
    const { requestId } = req.body;
    const request = await Request.findOne({ _id: requestId });
    if (!request) {
        const error = new CustomError("Could not found request!", 400);
        next(error);
    }

    await Request.updateOne({ _id: requestId }, { $set: { status: 'approved' } });
    res.status(201).json({ data: "Request approved succesfully!" });
})

export const rejectRequest = asyncErrorHandler(async (req, res, next) => {
    const { requestId } = req.body;
    const request = await Request.findOne({ _id: requestId });
    if (!request) {
        const error = new CustomError("Could not found request!", 400);
        next(error);
    }

    await Request.updateOne({ _id: requestId }, { $set: { status: 'rejected' } });
    res.status(201).json({ data: "Request rejected succesfully!" });
})

export const cancelRequest = asyncErrorHandler(async (req, res, next) => {
    const { requestId } = req.body;

    const request = await Request.findOne({ _id: requestId });
    if (!request) {
        const error = new CustomError("Could not found request!", 400);
        next(error);
    }

    await Request.updateOne({ _id: requestId }, { $set: { isDeleted: true } });
    res.status(201).json({ data: "Request Canceled succesfully!" });
})

export const getRentalReuqests = asyncErrorHandler(async (req, res, next) => {
    const { isDeleted, isOwner, status } = req.query;
    const { _id } = req.userDetails;
    const statusArray = Array.isArray(status) ? status : [status]
    const criteria = {
        ...(isOwner === 'true' ? { owner: _id } : { borrower: _id }),
        ...(isDeleted && { isDeleted }),
        ...(status && { status: { $in: statusArray } })
    }
    const allRequest = await Request.find(criteria).populate({
        path: "product",
        populate: {
            path: "address",
            model: "Address"
        }
    }).populate('borrower').populate('owner');
    return res.status(200).json({ data: allRequest });
})

export const makePayment = asyncErrorHandler(async (req, res, next) => {
    const { requestId } = req.body;
    if (!isValidObjectId(requestId)) {
        const customError = new CustomError("not valid item", 400);
        return next(customError);
    }

    const reqItem = await Request.findOne({ _id: requestId }).populate('product');

    const session = await stripe1.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: reqItem.product.title,
                        description: `Number of Days: ${reqItem.numberOfDays}`
                    },
                    unit_amount: (reqItem.priceApplied) * 100
                },
                quantity: reqItem.numberOfDays
            },
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: "Security Deposit",
                        description: "Refundable deposit"
                    },
                    unit_amount: reqItem.product.securityDeposit * 100
                },
                quantity: 1
            },
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: "Platform Fee",
                        description: "Service charge for platform usage"
                    },
                    unit_amount: 10 * reqItem.product.pricePerDay
                },
                quantity: 1
            }
        ],

        success_url: 'http://localhost:5173/requests?tab=sent',
        cancel_url: 'http://localhost:5173/cancel',
    })
    const obj = {
        request: reqItem._id,
        owner: reqItem.owner,
        product: reqItem.product,
        borrower: reqItem.borrower,
        dateRange: {
            startDate: new Date(reqItem.dateRange.startDate),
            endDate: new Date(reqItem.dateRange.endDate),
        },
        numberOfDays: reqItem.numberOfDays,
        total: reqItem.total,
        priceApplied: reqItem.priceApplied
    }
    await Agreement.create(obj);
    await Request.updateOne({ _id: reqItem._id }, { $set: { status: 'done' } });
    await Product.findOneAndUpdate(
        { _id: reqItem.product._id },
        { $push: { bookedSlots: reqItem.dateRange } },
        { new: true, upsert: true }
    );
    res.status(200).json({ data: session.url });
})

export const returnProduct = asyncErrorHandler(async (req, res, next) => {
    const { requestId } = req.query;
    const request = await Request.findOne({ _id: requestId }).lean();
    if (!request) {
        const customError = new CustomError("Request not found", 400);
        return next(customError);
    }
    const startDate = request.dateRange.startDate;
    const endDate = request.dateRange.endDate;
    await Product.updateOne({ _id: request.product }, { $pull: { bookedSlots: { startDate, endDate } } })
    await Request.updateOne({ _id: requestId }, { status: 'returned' });
    return res.status(200).json({ data: "Product returned successfully!" });
})