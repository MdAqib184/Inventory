// server/routes/auth.js

const router = require('express').Router();
const passport = require('passport');
const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;

// Local Strategy Setup
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'Incorrect email.' });
      
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Register new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password
    });
    
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login with email/password
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });
    
    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({ 
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)
        }
      });
    });
  })(req, res, next);
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));
router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: 'https://inventory-liard.vercel.app/dashboard',
    failureRedirect: 'https://inventory-liard.vercel.app/login'
  })
);

// Check authentication status
router.get('/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true, user: req.user });
    } else {
        res.json({ isAuthenticated: false });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
    if (err) {
        return res.status(500).json({ message: 'Error logging out' });
    }
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;