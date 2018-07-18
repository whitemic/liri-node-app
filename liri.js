require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];

function spotifySearch(query) {
    spotify.search({ type: 'track', query: query }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var root = data.tracks.items[0];
        console.log("-------------------");
        console.log("Artist(s): " + root.artists[0].name);
        console.log("Song Name: " + root.name);
        console.log("Preview Link: " + root.external_urls.spotify);
        console.log("Album Name: " + root.album.name);
        console.log("-------------------"); 
        });
}

// function makeSearchTerm() {
//     console.log("made it here");
//     var searchTerm = "";
//     console.log(process.argv.length);
//     for (var i = 2; process.argv.length; i++) {
//         console.log("made it here");
//         searchTerm += process.argv[i];
//     }
//     console.log(searchTerm);
// }

if (command === "my-tweets") {
    console.log("hi");
    var params = {screen_name: 'PennytheB'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {

        if (error) {
            console.log(error);
        }
        // console.log(tweets);
        for (var i = 0; i < 10; i++) {
            console.log("---------------------")
            console.log("Tweet content: " + tweets[i].text)
            console.log("Created at: " + tweets[i].created_at)
            console.log("---------------------")
        }
;
    });
} else {
    if (command === "spotify-this-song") {
        if (process.argv.length === 3) {
            spotifySearch("The Sign Ace of Base");
        } else {
            spotifySearch(process.argv[3]);
        }
    }

} 
