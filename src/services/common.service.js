import cloudinary from "cloudinary";
import CustomError from "../utils/customError.js";
import multer from "multer";
import envConfig from "../configs/envConfig.js";

envConfig();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

// global error handler
export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    console.log(err)
    return res.status(err.statusCode).json({
        success: false,
        status: err.statusCode,
        message: err.message
    });
}

export const asyncErrorHandler = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(err => next(err))
    }
}

export const sendError = (next, data, statusCode) => {
    const customError = new CustomError(data, statusCode);
    return next(customError)
}
export const sendSuccess = (res, data, statusCode) => {
    const resData = {
        success: true,
        data
    }
    return res.status(statusCode).json(resData)
}

export const imageUploader = async (req, location) => {
    let imageURLs = [];
    if (req?.file) {
        const imageFile = req.file;

        const uploadedImage = await cloudinary.uploader.upload(imageFile.path, {
            folder: location,
            public_id: imageFile.filename,
            use_filename: true,
            unique_filename: true
        })

        imageURLs = [uploadedImage.secure_url];
        return [null, imageURLs];
    }
    else {
        const error = new CustomError("Image not found!", 400);
        return [error, null];
    }
}

export const multerUpload = (dirName) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            return cb(null, `./src/uploads/${dirName}`);
        },
        filename: (req, file, cb) => {
            const fileExtension = file.originalname.split('.').pop();
            cb(null, `${file.originalname.split('.')[0]}_${file.fieldname}_${Date.now()}.${fileExtension}`);
        },
    });

    const upload = multer({ storage });
    return upload;
}