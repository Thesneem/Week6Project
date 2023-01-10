/* eslint-disable eqeqeq */
/* eslint-disable space-before-blocks */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
var express = require('express');
const { doLogin, doSignup } = require('../Helpers/user-helper');
const userHelper = require('../Helpers/user-helper');
const adminHelpers = require('../Helpers/admin-helpers');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res){
  const { user } = req.session;
  if (req.session.loggedIn){
    // eslint-disable-next-line eqeqeq
    if (user.access == 'User') {
      res.render('homepage');
    } else {
      res.redirect('/admin');
    }
  } else {
    res.render('user/login', { title: 'Website', Loginerr: req.session.Loginerr });
    req.session.Loginerr = false;
  }
});

router.get('/signup', function (req, res, next) {
  if (req.session.loggedIn) { res.render('homepage'); } else { res.render('user/signup'); }
});

router.post('/login', (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status){
      req.session.loggedIn = true;
      req.session.user = response.user;
      // console.log(req.session);
      // checking admin/user access
      userHelper.checkAccess(req.body).then((acc) => {
        const { user } = req.session;
        if (acc == 'User'){
          res.render('homepage');
        } else {
          adminHelpers.getAllUsers().then((users) => {
            res.render('admin/dashborad', { users });
          });
        }
      });
    } else {
      req.session.Loginerr = 'Invalid User Credentials!!';
      res.redirect('/');
    }
  });
});

router.post('/signup', (req, res) => {
  userHelper.userCheck(req.body).then((count) => {
    if (count > 0){
      const signuperr = 'Email id exist';
      res.render('user/signup', { signuperr });
    } else {
      userHelper.doSignup(req.body).then((response) => {
        res.render('user/login');
        if (req.session.loggedIn){
          res.render('homepage');
        }
      });
    }
  });
});

router.get('/login', (req, res) => {
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  // console.log(req.session);
  res.redirect('/');
});

module.exports = router;
