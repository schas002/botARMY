var express = require('express'),
    mastodon = require('./mastodon.js'),
    corpora = require('corpora-project');

function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
}

var cleaned = ['cleaned', 'cleared', 'wiped', 'swiped', 'sweeped', 'swept', 'scrubbed'],
    celebrities = corpora.getFile('humans', 'celebrities')['celebrities'],
    star = ['star', 'nebula'],
    respect = ['respect', 'praise', 'consideration'],
    occupations = corpora.getFile('humans', 'occupations')['occupations'],
    ashamed = ['', ' why', ' WHY', ' for reals', ' for reelz', ' FOR REALS', ' FOR REELZ',
               ' 😢', ' 😭', ' 😲', ' 😱'];

var app = express();

app.use(express.static('public')); // serve static files like index.html http://expressjs.com/en/starter/static-files.html

function generateStatus() {
  var result = sample(['', 'just ', 'Just ']) + sample(['stopped', 'Stopped']);
  result += ' and ' + sample(cleaned) + ' ' + sample(celebrities) + "'s " + sample(star);
  result += sample(['', '.', ',']) + ' ' + sample(['nothing', 'Nothing']) + ' but '
  result += sample(respect) + ' for ' + sample(['my', 'MY']) + ' ' + sample(occupations);
  return result + sample(ashamed);
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
