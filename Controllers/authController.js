const User = require("../models/users");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

//create token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};
const handleErrors = (err) => {
  let errors = { email: "", username: "", password: "" };

  // validation errors
  if (err.message.includes("UserSchema validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  } 

  // duplicate email error
  if (err.code === 11000) {
    if (err.message.includes("username")) {
      errors.username = "that username is already registered";
    } else if (err.message.includes("email")) {
      errors.email = "that email is already registered";
    }
    return errors;
  }
  return errors;
};

module.exports.signup_post = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const user = await User.create({ email, username, password });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user });
  } catch (err) {
    res.status(400).json(err);
  }
};
module.exports.logout_get = (req, res) => {
  return res.status(202).clearCookie("jwt").send("cookie cleared");
};
