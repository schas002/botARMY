var express = require('express'),
    mastodon = require('./mastodon.js'),
    corpora = require('corpora-project');

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var nouns = corpora.getFile('words', 'nouns')['nouns'],
    adjs = corpora.getFile('words', 'adjs')['adjs'],
    verbs = corpora.getFile('words', 'verbs')['verbs'];

var app = express();

app.use(express.static('public')); // serve static files like index.html http://expressjs.com/en/starter/static-files.html

function generateStatus() {
  var text = sample([sample(nouns), sample(adjs), sample(verbs)['present'] + 'ing',
                     sample(nouns) + 's', sample(adjs) + ' ' + sample(nouns),
                     sample(adjs) + ' ' + sample(nouns) + 's',
                     sample(adjs) + ' ' + sample(verbs)['present'] + 'ing']);
  text = text + sample([' ', '. ', ', ', '\n', '\n\n']);
  text = text + sample(['boost', 'retoot', 'rt', 'repeat', 'fav', 'love', 'like', 'star']);
  text = text + ' if ' + sample(['you', 'u']) + ' agree';
  return text;
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
