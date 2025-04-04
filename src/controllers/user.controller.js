import Address from "../models/address.model.js";
import User from "../models/user.model.js";
import { asyncErrorHandler, sendSuccess } from "../services/common.service.js";
import Redis from "ioredis";
const redis = new Redis();
export const getAddress = asyncErrorHandler(async (req, res, next) => {
    const allAddressIds = req.userDetails.address;
    const query = { _id: { $in: allAddressIds } }

    const data = await Address.find(query).lean();
    return res.status(200).json({ data });
})

export const getProfile = asyncErrorHandler(async (req, res, next) => {
    const userId = req.userDetails._id;
    const profileKey = `profile:${userId}`
    const redisChache = JSON.parse(await redis.get(profileKey))
    if (redisChache) {
        return sendSuccess(res, redisChache, 200);
    }
    const user = await User.findOne({ _id: userId }).populate('address');
    await redis.set(profileKey, JSON.stringify(user));
    return sendSuccess(res, user, 200);;
})