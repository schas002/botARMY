var express = require('express'),
    mastodon = require('./mastodon.js'),
    corpora = require('corpora-project');

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var nouns = corpora.getFile('words', 'nouns')['nouns'],
    days = ['Day', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday', 'Sunday', 'Week', 'Month'],
    invitations = ['', "It's ", "It's time for ", 'Mark your calendars for ',
      'Welcome to ', "You're invited to ", 'New activity: ', 'Celebrate '];

var app = express();

app.use(express.static('public')); // serve static files like index.html http://expressjs.com/en/starter/static-files.html

function generateStatus() {
  var invitation = sample(invitations) + '#\u200b' + sample(nouns) + sample(days);
  return invitation + sample(['', '!', ' today!', ' pls!']) + sample(['', ' :)', ' :D', ' Woo hoo!']);
}

app.all("/toot", function (request, response) { // send a GET or POST to /toot to trigger a toot http://expressjs.com/en/starter/basic-routing.html
  var newStatus = generateStatus();

  console.log("Got a hit!");
  var result = mastodon.tryToToot(newStatus);
  response.status(result.status).send(result.error);
  
});

console.log('Here is an example status:');
console.log(generateStatus());
console.log("✨🔮✨")

var thePort = process.env.PORT || 3000;
app.listen(thePort, function () {
  console.log('😎 Your app is listening on port ' + thePort);
});
