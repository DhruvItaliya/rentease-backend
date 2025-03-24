import Joi from 'joi';

export const signUpValidation = (req, res, next) => {
    const payload = req.body;
    const { error, value } = Joi.object({
        name: Joi.object({
            fname: Joi.string().min(3).max(30).required(),
            lname: Joi.string().min(3).max(30).required(),
        }).required(),

        email: Joi.string().email().required(),  // Email validation

        password: Joi.string().min(6).required(),  // Password should be at least 6 characters

        mobile: Joi.string().length(10).pattern(/^\d+$/).required(),  // 10-digit mobile number

        dob: Joi.date().less('now').required(),  // Date of birth should be in the past

        address: Joi.object({
            houseNo: Joi.string().pattern(/^[a-zA-Z\d\s-]+$/).min(1).required(),
            street: Joi.string().min(3).max(100).required(),
            landmark: Joi.string().min(3).max(100).optional(),
            city: Joi.string().min(3).max(50).required(),
            state: Joi.string().min(3).max(50).required(),
            pincode: Joi.string().length(6).pattern(/^\d+$/).required(),  // 6-digit pincode
        }).required(),
    }).validate(payload, { abortEarly: false });

    if (error) {
        const errors = error.details.map(e => ({
            key: e.context.key,
            message: e.message
        }))
        return res.status(400).json({
            status: 'validation fail',
            data: errors
        })
    }
    next();
}

export const signInValidation = (req, res, next) => {
    const payload = req.query;
    
    const { error, value } = Joi.object({
        email: Joi.string().email().required(),  // Email validation
        password: Joi.string().min(6).required(),  // Password should be at least 6 characters
    }).validate(payload, { abortEarly: false });

    if (error) {
        const errors = error.details.map(e => ({
            key: e.context.key,
            message: e.message
        }))
        return res.status(400).json({
            status: 'validation fail',
            data: errors
        })
    }
    next();
}