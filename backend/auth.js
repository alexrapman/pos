const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://provider.com/oauth2/authorize',
  tokenURL: 'https://provider.com/oauth2/token',
  clientID: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  callbackURL: 'http://localhost:3000/auth/callback'
},
(accessToken, refreshToken, profile, cb) => {
  User.findOrCreate({ oauthId: profile.id }, (err, user) => {
    return cb(err, user);
  });
}));

module.exports = passport;