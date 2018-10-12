//Install express server
const express = require('express');
const path = require('path');
const Cors = require('cors');

const app = express();


app.use(Cors({
  origin: 'https://pbiadnpoc.herokuapp.com',
  credentials: true
}));

// Serve only the static files form the dist directory
// Replace the '/dist/<to_your_project_name>'
app.use(express.static(__dirname + '/dist/pbiadnpoc'));

app.get('*', function(req,res) {
  // Replace the '/dist/<to_your_project_name>/index.html'
  res.sendFile(path.join(__dirname+ '/dist/pbiadnpoc/index.html'));
});
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);