const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Dummy user for demonstration
const user = {
  username: 'junjie',
  password: 'junjie'
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'junjie',
  resave: false,
  saveUninitialized: true,
}));

// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Login route
app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="POST">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username"><br><br>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password"><br><br>
      <input type="submit" value="Login">
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    req.session.user = username;
    res.redirect('/dashboard');
  } else {
    res.send('Invalid username or password');
  }
});

// Dashboard route (protected)
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send(`Welcome ${req.session.user}! <a href="/logout">Logout</a>`);
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
