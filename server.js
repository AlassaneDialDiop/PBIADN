//Install express server
const express = require('express');
const path = require('path');

const app = express();


const Cors = require('cors');


app.use(Cors({
  origin: "https://pbiadn.herokuapp.com",
  credentials: true
}));


// Serve only the static files form the dist directory
// Replace the '/dist/<to_your_project_name>'
app.use(express.static(__dirname + '/dist/pbiadn'));

app.use(Cors({
  origin: "https://pbiadn.herokuapp.com",
  credentials: true
}));


app.get('*', function(req,res) {
  // Replace the '/dist/<to_your_project_name>/index.html'
  res.sendFile(path.join(__dirname+ '/dist/pbiadn/index.html'));
});
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);