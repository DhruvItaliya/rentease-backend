import { asyncErrorHandler } from "../services/common.service.js";
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import CustomError from "../utils/customError.js";
import generateToken from '../utils/common.utils.js'
import Address from "../models/address.model.js";
import mongoose from "mongoose";

export const signUp = asyncErrorHandler(async (req, res, next) => {
    const payload = req.body;
    const user = await User.findOne({ email: payload.email });
    if (user) {
        const error = new CustomError("User with this email already exist!", 400);

        return next(error);
    }
    const hashedPass = await bcrypt.hash(payload.password, 10);
    const address = await Address.create({
        houseNo: payload.address.houseNo,
        street: payload.address.street,
        landmark: payload.address.landmark,
        city: payload.address.city,
        state: payload.address.state,
        pincode: payload.address.pincode,
    })
    const userObj = {
        name: {
            fname: payload.name.fname,
            lname: payload.name.lname,
        },
        email: payload.email,
        password: hashedPass,
        mobile: payload.mobile,
        dob: payload.dob,
        address: [address._id]
    }

    await User.create(userObj);
    return res.status(201).json({ data: "Account created successfully!" });
})

export const signIn = asyncErrorHandler(async (req, res, next) => {
    const payload = req.query;

    const user = await User.findOne({ email: payload.email }).select('+password').lean();
    if (user) {
        if (await bcrypt.compare(payload.password, user.password)) {
            delete user.password;
            const token = generateToken(user._id);
            const maxAge = 3600 * 1000;
            const options = {
                httpOnly: true,
                maxAge: maxAge,
                sameSite: "None",
                secure: true,
            }
            return res.status(200).cookie('token', token, options).json({ success: true, userData: user, auth_token: token });
        }
    }
    const error = new CustomError("Invalid email or password!", 400);
    return next(error);
})