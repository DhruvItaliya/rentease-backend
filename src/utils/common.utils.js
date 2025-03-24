import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export default function generateToken(userId) {
    const token = jwt.sign({ _id: userId }, process.env.SECRET_KEY);
    return token;
}

export function isValidObjectId(id){
    return mongoose.isValidObjectId(id);
}