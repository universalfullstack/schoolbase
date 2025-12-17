// config/passport.js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import {
  SuperAdmin,
  SchoolAdmin,
  Staff,
  Guardian,
  Student
} from '../models/User.js';

/* ----------------------------------
   Role → Model Mapping
----------------------------------- */
const ROLE_MODEL_MAP = {
  'Super Admin': SuperAdmin,
  'School Admin': SchoolAdmin,
  'Staff': Staff,
  'Guardian': Guardian,
  'Student': Student
};

export default function configurePassport() {

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'identifier',
        passReqToCallback: true
      },
      async (req, identifier, password, done) => {
        try {
          const { role } = req.body;

          if (!role || !ROLE_MODEL_MAP[role]) {
            return done(null, false, {
              message: 'Please select a valid role'
            });
          }

          const Model = ROLE_MODEL_MAP[role];

          // Find user ONLY in selected role collection
          const user = await Model.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
          });

          if (!user) {
            return done(null, false, {
              message: 'The credentials provided do not match our records'
            });
          }

          // Extra safety: role consistency check
          if (user.role !== role) {
            return done(null, false, {
              message: 'Invalid role for this account'
            });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, {
              message: 'The credentials provided do not match our records'
            });
          }

          // Optional: login enabled check
          if (user.loginEnabled === false) {
            return done(null, false, {
              message: 'Login has been disabled for this account'
            });
          }

          return done(null, user);

        } catch (err) {
          return done(err);
        }
      }
    )
  );

  /* ----------------------------------
     Serialize User
  ----------------------------------- */
  passport.serializeUser((user, done) => {
    done(null, { id: user._id, role: user.role });
  });

  /* ----------------------------------
     Deserialize User
  ----------------------------------- */
  passport.deserializeUser(async (obj, done) => {
    try {
      const { id, role } = obj;

      const Model = ROLE_MODEL_MAP[role];
      if (!Model) return done(null, false);

      const user = await Model.findById(id);
      done(null, user);

    } catch (err) {
      done(err);
    }
  });
}
