/** @format */

import jwt from 'jsonwebtoken';
import jwtValidator from 'express-jwt';

const jwtAccessOpts = { expiresIn: '1d' };
const jwtRefreshOpts = { expiresIn: '7d' };
const jwtActivateOpts = { expiresIn: '5m' };
const privateKey = process.env.PRIVATE_KEY || 'MeoSieuBeo';

function getAccessToken(payload) {
  // payload must be the user public information
  // don't store any private information at here
  return jwt.sign(payload, privateKey, jwtAccessOpts);
}

function getRefreshToken(payload) {
  // payload must be the user public information
  // don't store any private information at here
  return jwt.sign(payload, privateKey, jwtRefreshOpts);
}

function getActivationToken(payload) {
  // payload must be the user public information
  // don't store any private information at here
  return jwt.sign(payload, privateKey, jwtActivateOpts);
}

const verify = jwtValidator({
  secret: privateKey,
  algorithms: ['HS256'],
  getToken: (req) => req.cookies.token,
});

const jwtVerify = (payload) => {
  //payload must be acc_token or rf_token
  return jwt.verify(payload, privateKey);
};

const attachUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ msg: 'Authentication invalid !' });

  const decodedToken = jwt.decode(token);

  if (!decodedToken) {
    return res
      .status(401)
      .json({ msg: 'There was a problem authorizing the request !' });
  } else {
    req.user = decodedToken;
    next();
  }
};

function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ err: 'You must be admin to call this API' });
}

export {
  verify,
  jwtVerify,
  isAdmin,
  getAccessToken,
  getRefreshToken,
  getActivationToken,
  attachUser,
};
