/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable import/order */
/* eslint-disable no-var */
var db = require('../config/connection');
var collection = require('../config/collections');
const bcrypt = require('bcrypt');

module.exports = {
  doSignup: (userData) => new Promise(async (resolve, reject) => {
    // console.log(userData);
    userData.Password = await bcrypt.hash(userData.Password, 10);
    // console.log(userData.Password);
    db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
      resolve(data);
    });
  }),
  doLogin: (userData) => new Promise(async (resolve, reject) => {
    const loginStatus = false;
    const response = {};
    const user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email });
    // console.log(user);
    if (user) {
      bcrypt.compare(userData.Password, user.Password).then((status) => {
        if (status) {
          // console.log('login success');
          response.user = user;
          response.status = true;
          resolve(response);
        } else {
          // console.log('login failed');
          resolve({ status: false });
        }
      });
    } else {
      // console.log('User not found');
      resolve({ status: false });
    }
  }),
  userCheck: (userData) => new Promise(async (resolve, reject) => {
    // console.log(userData.email);
    const count = await db.get().collection(collection.USER_COLLECTION).countDocuments({ email: userData.email });
    // console.log(count);
    resolve(count);
  }),
  checkAccess: (userData) => new Promise(async (resolve, reject) => {
    // console.log(userData.access)
    const access = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email });
    // console.log(access.access);
    const acc = access.access;
    resolve(acc);
  }),

};
