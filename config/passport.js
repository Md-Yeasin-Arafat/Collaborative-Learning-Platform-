const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Load User model
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async(email, password, done) => {
      // Match user
      try{
        const user=await User.findOne({email:email});
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
       const isMatch=await bcrypt.compare(password, user.password ); 
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        }
        catch (error) {
            return done(error);
          }
        })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done)=> {
    try {
        const user = await User.findById(id);
        done(null, user);
      } catch (error) {
        done(error);
      }
    });
};
