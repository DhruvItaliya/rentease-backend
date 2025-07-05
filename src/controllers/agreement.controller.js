import Agreement from "../models/agreement.model.js";
import { asyncErrorHandler } from "../services/common.service.js";

export const getRentalAgreements = asyncErrorHandler(async (req, res, next) => {
    const { isDeleted, isOwner } = req.query;
    const { _id } = req.userDetails;
    const criteria = {
        ...(isOwner === 'true' ? { owner: _id } : { borrower: _id }),
    }
    const allRequest = await Agreement.find(criteria).populate({
        path: "product",
        populate: {
            path: "address",
            model: "Address"
        }
    }).populate('request').populate('borrower').populate('owner');
    return res.status(200).json({ data: allRequest });
})

export const returnProduct = asyncErrorHandler(async (req, res, next) => {
    const { agreementId } = req.body;
    const userId = req.userDetails._id;
    const agreement = await Agreement.findOne({ _id: agreementId }).lean();

})