import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import exphbs from 'express-handlebars';
import session from 'express-session';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  next();
};

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(
  session({
    name: 'AwesomeWebApp',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false
  })
);

app.use('/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/homepage');
  } else {
    next();
  }
});

app.use('/register', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/homepage');
  } else {
    next();
  }
});

app.use('/profile', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  } else {
    next();
  }
});
app.use('/trips', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  } else {
    next();
  }
});

app.use('/homepage', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  } else {
    next();
  }
});

app.use('/displayItinerary', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  } else {
    next();
  }
});

app.use('/logout', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  } else {
    next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
