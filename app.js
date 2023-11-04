const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose'); // Import passport-local-mongoose

// Configure Express
app.set('view engine', 'ejs'); // Set your view engine (EJS, Pug, etc.)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Database connection (use Mongoose or another database library)
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myapp');

// Define User model (Mongoose schema)
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  profilePic: String,
});

userSchema.plugin(passportLocalMongoose); // Add passport-local-mongoose plugin

const User = mongoose.model('User', userSchema);

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Route to render the dashboard view
app.get('/dashboard', isAuthenticated, (req, res) => {
  // Ensure user is authenticated before displaying the dashboard
  const user = req.user;
  res.render('dashboard', { user }); // Render the dashboard template with user data
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Route to open the local host (root URL)
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
