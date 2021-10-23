/** @format */

import User from '../models/UserModel.js';
import Account from '../models/AccountModel.js';
import bcrypt from 'bcrypt';
import * as auth from '../middlewares/auth.js';
import sendEmail from './sendEmail.js';
import Hogan from 'hogan.js';
import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SALT_WORK_FACTOR = process.env.SALT || 10;
const ClIENT_URL = process.env.CLIENT_URL;

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const handleLogIn = async (req, res) => {
  try {
    const reqBody = req.body;
    const exitsAcc = await Account.findOne({
      $or: [{ username: reqBody.username }, { email: reqBody.username }],
      isValid: true,
    }).populate({
      path: 'user',
      model: 'User',
      populate: {
        path: 'follower following avatar cover',
      },
    });

    if (!exitsAcc)
      return res
        .status(404)
        .json({ msg: 'Username or password is incorrect !' });

    const isMatch = await exitsAcc.comparePassword(reqBody.password);

    if (!isMatch)
      return res
        .status(404)
        .json({ msg: 'Username or password is incorrect !' });

    const access_token = auth.getAccessToken({
      id: exitsAcc.user._id,
      username: exitsAcc.username,
      fullname: exitsAcc.user.fullname,
      role: exitsAcc.role,
    });

    const refresh_token = auth.getRefreshToken({
      id: exitsAcc.user._id,
      username: exitsAcc.username,
      fullname: exitsAcc.user.fullname,
      role: exitsAcc.role,
    });

    res.cookie('token', refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      msg: 'Login success',
      username: exitsAcc.username,
      userDetail: exitsAcc.user,
      role: exitsAcc.role,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleSignUp = async (req, res) => {
  try {
    const reqBody = req.body;
    const template = readFileSync(__dirname + '/verifyEmail.hjs', 'utf-8');
    const compiledTemplate = Hogan.compile(template);

    if (reqBody.password !== reqBody.confirm_password)
      return res.status(404).json({ msg: 'Password do not match !' });

    const ctn = await Account.countDocuments({
      $or: [{ username: reqBody.username }, { email: reqBody.email }],
    });

    if (ctn >= 1)
      return res
        .status(404)
        .json({ msg: 'Username or email are already in use !' });

    if (reqBody.password < 6) {
      return res
        .status(404)
        .json({ msg: 'Password must be at least 6 characters.' });
    }

    if (!validateEmail(reqBody.email)) {
      return res.status(500).json({ msg: 'Invalid email address.' });
    }

    const hashPassword = bcrypt.hashSync(
      reqBody?.password,
      bcrypt.genSaltSync(SALT_WORK_FACTOR),
    );

    const newAcc = new Account({
      username: reqBody?.username.toLowerCase().replace(/ /g, ''),
      password: hashPassword,
      email: reqBody?.email,
    });

    const activation_token = auth.getActivationToken({
      newAcc,
      birthday: reqBody.birthday,
      fullname: reqBody.fullname,
    });

    const url = `${process.env.CLIENT_URL}/user/activation/${activation_token}`;

    sendEmail(reqBody.email, url, compiledTemplate);

    res.json({
      msg: 'Register success ! Please check your email to active account !',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const reqBody = req.body;

    const user = auth.jwtVerify(reqBody.activation_token);

    const newAcc = new Account(user.newAcc);

    let savedAcc = await newAcc.save();

    const newUser = new User({
      account: newAcc?._id,
      fullname: user?.fullname,
      birthday: user?.birthday,
    });

    const savedUser = await newUser.save();

    savedAcc = await Account.findByIdAndUpdate(
      savedAcc._id,
      {
        $set: { user: savedUser._id },
      },
      { new: true },
    );

    const access_token = auth.getAccessToken({
      id: savedAcc.user._id,
      username: savedAcc.username,
      fullname: savedAcc.user.fullname,
      role: savedAcc.role,
    });

    const refresh_token = auth.getRefreshToken({
      id: savedAcc.user._id,
      username: savedAcc.username,
      fullname: savedAcc.user.fullname,
      role: savedAcc.role,
    });

    res.cookie('token', refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res
      .status(201)
      .json({ msg: 'Login success', result: savedAcc, token: access_token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const handleLogout = async (req, res) => {
  try {
    res.clearCookie('refresh_token', { path: '/api/account/refresh_token' });
    res.status(200).json({ msg: 'Logout !' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleForgotPassword = async (req, res) => {
  try {
    const reqBody = req.body;
    const acc = await Account.findOne({ email: reqBody.email });
    if (!acc)
      return res.status(400).json({ msg: 'This email does not exist !' });
    const template = readFileSync(__dirname + '/forgotPassword.hjs', 'utf-8');
    const compiledTemplate = Hogan.compile(template);

    const access_token = auth.getAccessToken({ id: acc._id });
    const url = `${process.env.CLIENT_URL}/user/reset/${access_token}`;

    sendEmail(reqBody.email, url, compiledTemplate);
    res
      .status(200)
      .json({ msg: 'Success ! Please check your email to reset password.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const handleGenRefreshToken = async (req, res) => {
  try {
    const rf_token = req.cookies.refresh_token;

    if (!rf_token) {
      return res.status(400).json({ msg: 'Please login first !' });
    }

    const user = auth.jwtVerify(rf_token);

    const exitsAcc = await Account.findOne({
      username: user.username,
      isValid: true,
    }).populate({
      path: 'user',
      model: 'User',
      populate: {
        path: 'follower following',
        model: 'User',
      },
    });

    if (!exitsAcc)
      return res
        .status(404)
        .json({ error: 'Username or password is incorrect !' });

    const access_token = auth.getAccessToken({
      username: exitsAcc.username,
      fullname: exitsAcc.user.fullname,
      role: exitsAcc.role,
    });

    res.status(200).json({
      access_token,
      username: exitsAcc.username,
      user: exitsAcc.user,
      role: exitsAcc.role,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const searchAccount = (req, res) => {};

const updatePasswordByUsername = async (req, res) => {
  try {
    const reqBody = req.body;

    if (reqBody.password !== reqBody.confirm_password)
      return res.status(404).json({ error: 'Password do not match !' });

    const hashPassword = bcrypt.hashSync(
      reqBody?.password,
      bcrypt.genSaltSync(SALT_WORK_FACTOR),
    );

    await Account.findByIdAndUpdate(req.user.id, { password: hashPassword });

    res.status(200).json({ msg: 'Password successfully changed !' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const csrfToken = (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
};

export {
  handleLogIn,
  handleSignUp,
  updatePasswordByUsername,
  handleLogout,
  handleGenRefreshToken,
  verifyEmail,
  handleForgotPassword,
  csrfToken,
};
