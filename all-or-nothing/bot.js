var express = require('express'),
    mastodon = require('./mastodon.js'),
    corpora = require('corpora-project'),
    capitalize = require('capitalize');

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var nouns = corpora.getFile('words', 'nouns')['nouns'];

var app = express();

app.use(express.static('public')); // serve static files like index.html http://expressjs.com/en/starter/static-files.html

function generateStatus() {
  var question = capitalize(sample(nouns)) + ' or ' + sample(nouns) + '? ';
  question += capitalize(sample(nouns)) + ' or ' + sample(nouns) + '? ';
  return question + 'All or nothing?';
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
