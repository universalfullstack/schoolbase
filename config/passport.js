// config/passport.js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { SuperAdmin, SchoolAdmin, Staff, Guardian } from '../models/User.js';

const UserModels = [SuperAdmin, SchoolAdmin, Staff, Guardian];

export default function configurePassport() {

  passport.use(
    new LocalStrategy({ usernameField: 'identifier', passReqToCallback: true }, async (req, identifier, password, done) => {
      try {
        let user = null;

        // Try to find the user in all models by email OR phone
        for (const Model of UserModels) {
          user = await Model.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
          if (user) break;
        }

        if (!user) {
          return done(null, false, { message: 'The credentials provided do not match our records' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'The credentials provided do not match our records' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Serialize user into the session
  passport.serializeUser((user, done) => {
    done(null, { id: user._id, role: user.role });
  });

  // Deserialize user from the session
  passport.deserializeUser(async (obj, done) => {
    try {
      let user = null;
      const { id, role } = obj;

      switch (role) {
        case 'Super Admin':
          user = await SuperAdmin.findById(id);
          break;
        case 'School Admin':
          user = await SchoolAdmin.findById(id);
          break;
        case 'Staff':
          user = await Staff.findById(id);
          break;
        case 'Guardian':
          user = await Guardian.findById(id);
          break;
      }

      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}
