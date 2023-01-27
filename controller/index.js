const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/index');
const jwt = require('jsonwebtoken');

//Function to create new user
exports.signup = (req, res) => {
    const { name, email, username, password } = req.body;

    User.findOne({ username }).then(user => {
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const newUser = new User({
            username,
            password,
            name,
            email
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err)
                    throw err;
                newUser.password = hash;
                newUser.save().then(user => {
                    return res.status(200).json({ user });
                });
            });
        });
    });
};

//Function to login registered user
exports.login = (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username }).then(user => {
        if (!user)
            return res.status(404).json({ msg: 'User not found' });

        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch)
                return res.status(400).json({ msg: 'Invalid credentials' });

            jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' },
                (err, token) => {
                    if (err)
                        throw err;
                    res.status(200).json({
                        token,
                        user: {
                            id: user._id,
                            username: user.username
                        }
                    });
                }
            );
        });
    });
};

//Fuction to show detail of specific user
exports.user = (req, res) => {
    User.findOne({ username: req.params.username }).then(user => {
        if (!user) return res.status(404).json({ msg: 'User not found' });
        return res.json({ user });
    });
}

//Function to show followers of a User
exports.followers = (req, res) => {
    User.findOne({ username: req.params.username }).then(user => {
        if (!user) return res.status(404).json({ msg: 'User not found' });
        return res.json({ followers: user.followers });
    });
};

//Function to show users a specific user is following
exports.following = (req, res) => {
    User.findOne({ username: req.params.username }).then(user => {
        if (!user) return res.status(404).json({ msg: 'User not found' });
        return res.json({ following: user.following });
    });
};

//Function to follow a user
exports.follow = (req, res) => {
    User.findOne({ username: req.params.username }).then(user => {
        if (!user) return res.status(404).json({ msg: 'User not found' });
        User.findOneAndUpdate(
            { _id: req.user.id },
            { $push: { following: user._id } },
            { new: true }
        ).then(updatedUser => {
            User.findOneAndUpdate(
                { username: req.params.username },
                { $push: { followers: req.user.id } },
                { new: true }
            ).then(user => {
                return res.json({ message: "Followed successfully" });
            });
        });
    });
};

//Function to unfollow a user
exports.unfollow = (req, res) => {
    User.findOne({ username: req.params.username }).then(user => {
        if (!user) return res.status(404).json({ msg: 'User not found' });
        User.findOneAndUpdate(
            { _id: req.user.id },
            { $pull: { following: user._id } },
            { new: true }
        ).then(updatedUser => {
            User.findOneAndUpdate(
                { username: req.params.username },
                { $pull: { followers: req.user.id } },
                { new: true }
            ).then(user => {
                return res.json({ message: "Unfollowed successfully" });
            });
        });
    });
};