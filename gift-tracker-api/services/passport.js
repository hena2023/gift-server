const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const User = require("../models/userSchema");


passport.use(
  new GoogleStrategy(
    {
      clientID: "133121511478-t756gjiue4i3mrjk4umjissco8qicd1g.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: keys.google.callbackURL,
      proxy:true
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName } = profile;
      const user = await User.findOneAndUpdate(
        { googleId: id },
        { name: displayName },
        { upsert: true, new: true }
      );
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;
