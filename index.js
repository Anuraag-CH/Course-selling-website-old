const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());

const secretKey = process.env.SECRET_KEY


// Connection URL
const url = 'mongodb://127.0.0.1:27017/courses';

// Connect to MongoDB using Mongoose
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Define mongoose schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});

// Define mongoose models
const User = mongoose.model('user', userSchema);
const Admin = mongoose.model('admin', adminSchema);
const Course = mongoose.model('course', courseSchema);

const authenticateJwt = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      user = jwt.verify(token, secretKey)
      req.user = user
      next()
    }
    catch (err) {
      res.sendStatus(403)
      console.log(err)
    }
  }
  else {
    res.sendStatus(401)
  }

};

// Admin routes
app.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body;
  // Check if username is in database
  const foundAdmin = await Admin.findOne({ username });

  if (foundAdmin) {
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    // Handle the case when the username does not exist
    const newAdmin = new Admin(req.body)
    await newAdmin.save()

    //send jwt
    const token = jwt.sign({ username, role: 'admin' }, secretKey, { expiresIn: '1h' });
    res.json({ message: 'Admin created successfully', token })

  }
});

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: 'admin' }, secretKey, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.post('/admin/courses', authenticateJwt, async (req, res) => {
  if (req.user.role === "admin") {
    const course = new Course(req.body);
    await course.save();
    res.json({ message: 'Course created successfully', courseId: course.id });
  }
  else {
    res.sendStatus(403)
  }

});

app.put('/admin/courses/:courseId', authenticateJwt, async (req, res) => {
  if (req.user.role === "admin") {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
      res.json({ message: 'Course updated successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  }
  else {
    res.sendStatus(403)
  }
});

app.get('/admin/courses', authenticateJwt, async (req, res) => {
  // Logic to get all courses
  if (req.user.role === "admin") {
    const courses = await Course.find({})
    if (courses) {
      res.json(courses);
    } else {
      res.status(404).json({ message: 'Courses not found' });
    }
  }
  else {
    res.sendStatus(403)
  }
});

// User routes
app.post('/users/signup', async (req, res) => {
  const { username, password } = req.body;
  // Check if username is in database
  const foundUser = await User.findOne({ username });

  if (foundUser) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    // Handle the case when the username does not exist
    const newUser = new User(req.body)
    await newUser.save()

    //send jwt
    const token = jwt.sign({ username, role: 'user' }, secretKey, { expiresIn: '1h' });
    res.json({ message: 'User created successfully', token })

  }
});

app.post('/users/login', async (req, res) => {
  const { username, password } = req.headers;
  const foundUser = await User.findOne({ username, password });
  if (foundUser) {
    const token = jwt.sign({ username, role: 'user' }, secretKey, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.get('/users/courses', authenticateJwt, async (req, res) => {
  const courses = await Course.find({ published: true });
  res.json({ courses });
});

app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  console.log(course);
  if (course) {
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', authenticateJwt, async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
