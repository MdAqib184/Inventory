// server/routes/auth.js
const router = require("express").Router();
const passport = require("passport");
const User = require("../models/User");
const LocalStrategy = require("passport-local").Strategy;

// Local Strategy Setup
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) return done(null, false, { message: "Incorrect email." });

        const isMatch = await user.comparePassword(password);
        if (!isMatch)
          return done(null, false, { message: "Incorrect password." });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Register new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login with email/password
router.post("/login", async (req, res, next) => {
  const { pin } = req.body;

  try {
    if (!pin) {
      return res.status(400).json({ message: "Pin is required" });
    }

    if (Number(pin) !== 988311) {
      return res.status(400).json({ message: "Invalid pin" });
    }

    // If user is found, return success response
    res
      .json({
        message: "Login successful",
        user: {
          id: "1",
          name: "Variety Collection",
        },
      })
      .status(200);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check authentication status
router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;
