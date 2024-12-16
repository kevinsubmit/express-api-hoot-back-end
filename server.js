const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const usersRouter = require('./controllers/auth');
const profilesRouter = require('./controllers/profiles');
const cors = require('cors');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());
app.use(cors());


app.use('/auth', usersRouter);
app.use('/profiles', profilesRouter);


app.get('/',(req,res) => {
    res.json({"mes":"hello"})
})


// 使用 Heroku 提供的端口，如果没有则使用默认端口 5000
const port = process.env.PORT || 5000;
// Routes go here
app.listen(port, () => {
  console.log('The express app is ready!');
});
