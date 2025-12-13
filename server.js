import express from 'express';
import DotenvFlow from 'dotenv-flow';
import session from 'express-session';
import flash from 'connect-flash';
import connectDB from './config/db.js';
import MongoStore from 'connect-mongo';
import subdomain from 'express-subdomain';
import { engine } from 'express-handlebars';
import hbsHelpers from './helpers/hbsHelpers.js';
import baseRoutes from './routes_base/index.js';
import subdomainResolver from './middleware/subdomainResolver.js';
import appSettings from './middleware/appSettings.js';
import passport from 'passport';
import configurePassport from './config/passport.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Environment setup
DotenvFlow.config();

// __dirname replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session store
const mongoStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: 'sessions',
  ttl: 14 * 24 * 60 * 60, // 14 days
  autoRemove: 'native',
});

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
    },
  })
);

// Passport setup
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Get app settings
app.use(appSettings);

// Set locals for handlebars
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.user?.toObject() || null;
  res.locals.currentPath = req.path;
  res.locals.year = new Date().getFullYear();
  res.locals.settings = req.appSettings || null;
  console.log('Settings: ', res.locals.settings)
  next();
});

// View engine
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    helpers: hbsHelpers,
  })
);

// Set default views folder for base routes
app.set('views', path.join(__dirname, 'views'));

// Mount base routes on root domain
app.use(baseRoutes);

// Mount subdomain routes
app.use(
  subdomain('*', (req, res, next) => {
    // Dynamically set views folder for school subdomain
    subdomainResolver(req, res, next);
  })
);

// Start server
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
