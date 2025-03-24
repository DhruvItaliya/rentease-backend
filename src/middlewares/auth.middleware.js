import jwt from 'jsonwebtoken';
import CustomError from '../utils/customError.js';
import User from "../models/user.model.js";
import { asyncErrorHandler } from "../services/common.service.js";

const auth = asyncErrorHandler(async (req, res, next) => {
    const token = req.headers?.authorization?.split(" ")[1];
    if (token) {
        const verifyUser = await jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({ _id: verifyUser._id }).lean();
        if (user) {
            req.userDetails = user;
            return next();
        }
    }

    const error = new CustomError("Unauthorized User!", 401);
    return next(error);
})

export default auth;
