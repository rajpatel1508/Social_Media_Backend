const express = require("express");
const app = express();
const users = require('./routes/index');
const mongoose = require('mongoose');
const env = require('dotenv');

env.config();
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', users);

app.listen(2000, () => console.log('Server started on port 2000'))