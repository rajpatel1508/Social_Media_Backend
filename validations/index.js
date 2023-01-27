const { check, validationResult } = require('express-validator');

exports.validateSignupRequest = [
    check('Name')
        .isEmpty()
        .withMessage('Name is required'),
    check('email')
        .isEmail()
        .withMessage('Valid Email is required'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 character long'),
    check('Username')
        .isEmpty()
        .withMessage('Username is required')
];

exports.validateSigninRequest = [
    check('Username')
        .isEmpty()
        .withMessage('Userame is required'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 character long')
];

exports.isRequestValidated = (req, res, next) => {

    const errors = validationResult(req);
    if (errors.array().length > 0) {
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next();
}