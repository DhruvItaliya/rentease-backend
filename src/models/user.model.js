import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        fname: { type: String },
        lname: { type: String }
    },
    email: { type: String, unique: true },
    password: { type: String, select: false },
    dob: Date,
    mobile: String,
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }],
    profileImg: String,
    verified: { type: Boolean, default: false },
    ratings: { type: Number, default: 0 },
    totalRentals: { type: Number, default: 0 },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [], required: true }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User; 
