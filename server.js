const User = require("./models/User")
const express = require("express")
require("dotenv").config()
const passport = require("passport")
require("./config/passport")

const app = express()

const PORT = process.env.PORT || 7777

app.use(express.json())

// Our Default route! Right now...
app.get('/',(req, res) =>{
  const {token} = req.query // we check for a Token
  token ? res.send("We have a token! Check the URL at the top!") : res.send("No token!") // and send different information based on if there is a token or not
})

app.get( // we have a route that will Send them to authenticate with gitHub
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }) // Request email scope (and actually send them to GitHub to sign in)
);

// The callback route that GitHub will redirect to after the user approves.
app.get(
'/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login', // Where to redirect if user denies
    session: false // We are using tokens, not sessions
  }),
  (req, res) => {
    // At this point, `req.user` is the user profile returned from the verify callback.
    // We can now issue our own JWT to the user.
    const FAKE_TOKEN = "here-is-where-our-token-would-go-if-mongo-cooperated";
    // Redirect the user to the frontend with the token, or send it in the response
    // res.redirect(\`\$FRONTEND_REDIRECT_URL=?token=\${FAKE_TOKEN}\`);
	res.send(`Token would go here: ${FAKE_TOKEN}`);
  }
);

app.listen(PORT, () =>{
    console.log("Listening! "+ PORT)
})
