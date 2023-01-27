const jwt = require('jsonwebtoken');

//Middleware to authenticate user
exports.requiresignin = (req, res, next) => {
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization;
            const user = jwt.verify(token, process.env.JWT_SECRET);
            console.log({ user });
            req.user = user;
        } catch {
            res.status(400).json({ message: 'Something went wrong' });
        }
    }
    else {
        res.status(400).json({ message: 'Authorization required' });
    }
    next();
}