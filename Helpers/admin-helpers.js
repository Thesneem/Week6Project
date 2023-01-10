/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable import/order */
/* eslint-disable no-var */
/* eslint-disable linebreak-style */
var db = require('../config/connection');
var collection = require('../config/collections');
const bcrypt = require('bcrypt');
var objectId = require('mongodb').ObjectId;

module.exports = {
  getAllUsers: () => new Promise(async (resolve, reject) => {
    const users = await db.get().collection(collection.USER_COLLECTION).find().toArray();
    resolve(users);
  }),
  addUser: (FormData) => new Promise(async (resolve, _reject) => {
    // console.log(FormData);
    FormData.Password = await bcrypt.hash(FormData.Password, 10);
    // console.log(FormData.Password);
    db.get().collection(collection.USER_COLLECTION).insertOne(FormData).then((data) => {
      resolve(data);
    });
  }),
  CheckUser: (FormData) => new Promise(async (resolve, reject) => {
    // console.log(FormData.email);
    const count = await db.get().collection(collection.USER_COLLECTION).countDocuments({ email: FormData.email });
    // console.log(count);
    resolve(count);
  }),
  deleteUser: (userId) => new Promise((resolve, reject) => {
    db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: objectId(userId) }).then((response) => {
      // console.log(response)
      resolve(response);
    });
  }),
  getUserDetails: (userId) => new Promise((resolve, reject) => {
    db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) }).then((user) => {
      resolve(user);
    });
  }),
  editUser: (userId, userDetails) => new Promise((resolve, reject) => {
    db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objectId(userId) }, {
      $set: {
        firstname: userDetails.firstname,
        lastname: userDetails.lastname,
        email: userDetails.email,
        Password: userDetails.Password,
        access: userDetails.access,
      },
    }).then((response) => {
      resolve();
    });
  }),

};
