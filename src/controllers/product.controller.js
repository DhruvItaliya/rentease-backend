import Product from "../models/product.model.js";
import _ from 'lodash';
import { asyncErrorHandler, imageUploader } from "../services/common.service.js";
import CustomError from "../utils/customError.js";
import mongoose from "mongoose";

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

export const getProductById = async (req, res, next) => {
    try {

        const { productId } = req.params;
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            next(new CustomError("Product Not Found", 400))
        }
        const product = await Product.findOne({ _id: productId });
        res.status(200).json({ data: product });
    }
    catch (error) {
        res.status(400).json({ data: error.message });
    }
}

