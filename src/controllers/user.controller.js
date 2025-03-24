import Address from "../models/address.model.js";
import User from "../models/user.model.js";
import { asyncErrorHandler } from "../services/common.service.js";

export const getAddress = asyncErrorHandler(async (req, res, next) => {
    const allAddressIds = req.userDetails.address;
    const query = { _id: { $in: allAddressIds } }

    const data = await Address.find(query).lean();
    return res.status(200).json({ data });
})

export const getProfile = asyncErrorHandler(async (req, res, next) => {
    const userId = req.userDetails._id;

    const user = await User.findOne({ _id: userId }).populate('address');
    return res.status(200).json({ data: user });
})