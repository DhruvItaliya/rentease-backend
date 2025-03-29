import Product from "../models/product.model.js";
import _ from 'lodash';
import { asyncErrorHandler, imageUploader } from "../services/common.service.js";
import CustomError from "../utils/customError.js";
import mongoose, { isValidObjectId } from "mongoose";
import User from "../models/user.model.js";

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
    return res.status(201).json({
        data: "Product added successfully!"
    });
})

export const getProducts = asyncErrorHandler(async (req, res, next) => {
    const { category, searchTerm } = req.query

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
                        category: category ?? { $exists: true }
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
                buyDate: 1,
                bookedSlots: 1,
                address: { city: '$address.city', state: '$address.state' },
                owner: { name: '$owner.name' }
            }
        }
    ])
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

