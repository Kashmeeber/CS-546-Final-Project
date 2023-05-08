//import express, express router as shown in lecture code
import { users } from '../config/mongoCollections.js';
import { Router } from 'express';
import * as userData from '../data/users.js';
import * as tripData from '../data/trips.js';
import * as itineraryData from '../data/itinerary.js';

const router = Router();
router.route('/').get(async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.redirect('/login');
});

router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    return res.render('register', { title: 'register' });
  })
  .post(async (req, res) => {
    //code here for POST
    let userInfo = req.body;
    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res.status(400).json({ error: 'There are no fields in the request body' });
    }

    let retVal = undefined;
    try {
      retVal = await userData.createUser(
        userInfo.firstNameInput,
        userInfo.lastNameInput,
        userInfo.emailAddressInput,
        userInfo.passwordInput
      );
      // return res.json(retVal);
    } catch (e) {
      return res.status(400).render('register', { error: e });
    }
    if (retVal) {
      return res.redirect('/login');
    }
  });

router
  .route('/login')
  .get(async (req, res) => {
    //code here for GET
    return res.render('login', { title: 'login' });
  })
  .post(async (req, res) => {
    //code here for POST
    let userInfo = req.body;
    if (!userInfo.emailAddressInput || !userInfo.passwordInput) {
      return res.render('login', { title: 'login' });
    }
    let retVal = undefined;
    try {
      retVal = await userData.checkUser(userInfo.emailAddressInput, userInfo.passwordInput);
      // res.json(retVal);
    } catch (e) {
      return res
        .status(400)
        .render('login', { error: 'Invalid username/password', title: 'login' });
    }
    if (retVal) {
      req.session.user = retVal;
      return res.redirect('/homepage');
    } else {
      return res.status(500).render('error');
    }
  });

router.route('/homepage').get(async (req, res) => {
  //code here for GET
  return res.render('homepage', { title: 'welcome to CART!' });
});

router.route('/trips').get(async (req, res) => {
  return res.render('tripplanning', { title: 'create a new trip!' });
});

router.route('/trips/trip/:tripName').get(async (req, res) => {
  return res.render('edittrip', { title: 'edit trip: ' + req.params.tripName });
});

router.route('/profile').get(async (req, res) => {
  //code here for GET
  let tData = await tripData.getAll(req.session.user.id);

  return res.render('profile', {
    firstNameInput: req.session.user.firstName,
    lastNameInput: req.session.user.lastName,
    emailAddressInput: req.session.user.emailAddress,
    trips: tData,
    title: 'profile'
  });
});

router.route('/displayItinerary').get(async (req, res) => {
  //code here for GET
  let tData = await tripData.getAll(req.session.user.id);

  return res.render('displayItinerary', {
    firstNameInput: req.session.user.firstName,
    lastNameInput: req.session.user.lastName,
    emailAddressInput: req.session.user.emailAddress,
    trips: tData,
    title: 'itinerary'
  });
});

router.route('/error').get(async (req, res) => {
  //code here for GET
  return res.render('error', { title: 'error' });
});

router.route('/logout').get(async (req, res) => {
  //code here for GET
  req.session.destroy();
  return res.render('logout', { title: 'logout' });
});

export default router;
