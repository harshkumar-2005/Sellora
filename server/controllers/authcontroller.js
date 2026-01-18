import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import User from "../models/users.js";
import { hash } from "../passwordHashing/hash.js";


const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
  const { firstName, email, password } = req.body;

  if (!firstName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User already exists'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  try {
    const hashedPassword = await hash(password);

    const user = await User.create({
      firstName,
      email,
      password: hashedPassword,
      role: 'user'
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      'success': false,
      'message': 'Email and password both are required for login'
    })
  }

  try {
    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) {
      return res.status(400).json({
        'success': false,
        'message': "User not found"
      })
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      return res.status(401).json({
        "success": false,
        "message": "Email or Password is incorrect"
      })
    }

    const token = jwt.sign({
      id: foundUser._id,
      email: foundUser.email,
      role: foundUser.role
    }, JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      "success": true,
      "message": "You are logged in sucessfull",
      token
    })
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      'success': false,
      'message': "Internal server error"
    })
  }
}


export const getme = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      'sucess': true,
      message: 'You are sucessfully loggedin',
      user: user
    });
  } catch (error) {
    return res.status(400).json({
      sucess: false,
      message: "Internal server error"
    })
  }
}