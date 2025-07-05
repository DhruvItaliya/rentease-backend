import Product from "../models/product.model.js";
import _ from 'lodash';
import { asyncErrorHandler, imageUploader, sendSuccess } from "../services/common.service.js";
import CustomError from "../utils/customError.js";
import mongoose, { isValidObjectId } from "mongoose";
import User from "../models/user.model.js";
import Redis from "ioredis";
import { notifyUsers } from "./notification.controller.js";
const redis = new Redis();
export const addProduct = asyncErrorHandler(async (req, res, next) => {
    const { payload } = req.body;
    const productObj = {
        owner: req.userDetails._id,
        title: payload.title,
        description: payload.description,
        category: payload.category,
        pricePerDay: payload.dprice,
        pricePerWeek: payload.wprice,
        pricePerMonth: payload.mprice,
        address: payload.address,
        rules: payload.rules,
        securityDeposit: payload.securityDeposit || 0,
        images: payload.imageURLs,
        buyDate: payload.buyDate,
        isAgreed: payload.isAgreed
    };

    await Product.create(productObj);
    await redis.del('product:all')
    return res.status(201).json({
        data: "Product added successfully!"
    });
})

export const getProducts = asyncErrorHandler(async (req, res, next) => {
    const { category, searchTerm, isMyProducts = false } = req.query
    const userId = req.userDetails?._id
    let cacheData;
    // if (!searchTerm && !category) {
    //     cacheData = JSON.parse(await redis.get('product:all'));
    //     if (cacheData) {
    //         return sendSuccess(res, cacheData, 200);
    //     }
    // }
    let productsQuery = await Product.aggregate([
        {
            $lookup: {
                from: 'addresses',
                localField: 'address',
                foreignField: '_id',
                as: 'address'
            }
        },
        {
            $unwind: '$address'
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
            }
        },
        {
            $unwind: '$owner'
        },
        {
            $match: {
                $and: [
                    {
                        $or: [
                            { title: { $regex: new RegExp(searchTerm, 'i') } },
                            { description: { $regex: new RegExp(searchTerm, 'i') } },
                            { 'address.city': { $regex: new RegExp(searchTerm, 'i') } }
                        ]
                    },
                    {
                        category: category ?? { $exists: true },
                        'owner._id': { ...(isMyProducts ? { $eq: userId } : { $ne: userId }) }
                    }
                ]
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                images: 1,
                category: 1,
                pricePerDay: 1,
                pricePerWeek: 1,
                pricePerMonth: 1,
                securityDeposit: 1,
                buyDate: 1,
                isAvailable: 1,
                bookedSlots: 1,
                address: { city: '$address.city', state: '$address.state' },
                owner: { name: '$owner.name' },
                createdAt: 1,
                updatedAt: 1
            }
        }
    ])
    // if (!searchTerm && !category && !cacheData) {
    //     await redis.set('product:all', JSON.stringify(productsQuery));
    // }

    return res.status(200).json({
        data: productsQuery
    })
})

export const uploadImage = asyncErrorHandler(async (req, res, next) => {
    const location = 'Home/RentEase/products'
    const [err, imageURLs] = await imageUploader(req, location);
    // const [err, imageURLs] = [null, 'https://res.cloudinary.com/dwsrczag1/image/upload/v1739553627/orxc2prnyup3zkikwbjr.jpg']
    if (err) return next(err);
    return res.status(201).json({ data: imageURLs });
})

export const getProductById = asyncErrorHandler(async (req, res, next) => {
    const { productId } = req.params;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return next(new CustomError("Product Not Found", 400))
    }
    const product = await Product.findOne({ _id: productId }).populate('address', 'city state pincode').populate('owner', 'name').lean();
    res.status(200).json({ data: product });
})

export const changeWishlist = asyncErrorHandler(async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.userDetails._id;
    if (!isValidObjectId(productId) || !isValidObjectId(userId)) {
        const customError = new CustomError('Product Not Found', 400);
        return next(customError);
    }

    const user = await User.findById(userId);

    const isWishlisted = user?.wishlist?.includes(productId);
    if (isWishlisted) {
        // Remove product from wishlist
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    } else {
        // Add product to wishlist
        user?.wishlist.push(productId);
    }

    await user.save();

    return res.json({ success: true, added: !isWishlisted });
})

export const getWishlist = asyncErrorHandler(async (req, res, next) => {
    const userId = req.userDetails._id;
    const user = await User.findById(userId).select('+wishlist');
    return res.json({ success: true, data: user.wishlist });
})

export const updateProduct = asyncErrorHandler(async (req, res, next) => {
    const { productId } = req.params;
    const { description, pricePerDay, pricePerWeek, pricePerMonth, isAvailable } = req.body;
    console.log(isAvailable)
    const updateData = {
        ...(description && { description }),
        ...(pricePerDay && { pricePerDay }),
        ...(pricePerWeek && { pricePerWeek }),
        ...(pricePerMonth && { pricePerMonth }),
        ...(isAvailable !== undefined && { isAvailable })
    }
    console.log(updateData)
    const product = await Product.findOne({ _id: productId });
    if (!product) {
        const error = new CustomError("Product Not Found!", 400);
        next(error);
    }
    await Product.updateOne({ _id: productId }, { $set: updateData })
    if (isAvailable) notifyUsers(productId)
    return res.json({ success: true, data: "Product Updated!" });
})

