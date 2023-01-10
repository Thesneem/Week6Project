/* eslint-disable eqeqeq */
/* eslint-disable no-var */
var express = require('express');
const adminHelpers = require('../Helpers/admin-helpers');

var router = express.Router();

/* GET users listing. Admin Dasboard */
router.get('/', (req, res) => {
  const { user } = req.session;
  if (user.access == 'Admin') {
    adminHelpers.getAllUsers().then((users) => {
      res.render('admin/dashborad', { users });
    });
  } else {
    res.redirect('/');
  }
});

router.get('/add-users', (req, res) => {
  res.render('admin/add-users');
});

router.post('/add-users', (req, res) => {
  adminHelpers.CheckUser(req.body).then((count) => {
    if (count > 1) {
      res.send('Already exist');
    } else {
      // eslint-disable-next-line no-unused-vars
      adminHelpers.addUser(req.body).then((response) => {
        res.redirect('/admin');
      });
    }
  });
});

router.get('/delete-user/:id', (req, res) => {
  const userId = req.params.id;
  // console.log(userId);
  // eslint-disable-next-line no-unused-vars
  adminHelpers.deleteUser(userId).then((response) => {
    res.redirect('/admin');
  });
});

router.get('/edit-users/:id', async (req, res) => {
  const user = await adminHelpers.getUserDetails(req.params.id);
  res.render('admin/edit-users', { user });
});

router.post('/edit-users/:id', (req, res) => {
  adminHelpers.CheckUser(req.body).then((count) => {
    if (count > 1) {
      res.send('Email id exist');
    } else {
      adminHelpers.editUser(req.params.id, req.body).then(() => {
        res.redirect('/admin');
      });
    }
  });
});

router.get('/home', (req, res) => {
  res.render('homepage');
});

router.get('/signout', (req, res) => {
  res.render('user/login');
});

module.exports = router;
