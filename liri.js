require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
var fs = require("fs");
var dataArray = [];
var readCommand = false;
var noInput = "";

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

if (process.argv.length > 3) {
    noInput = false;
} else {
    noInput = true;
}

var command = process.argv[2];
var term = process.argv.splice(3).join(" ");

function getTweets() {
    var params = {screen_name: 'PennytheB'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log(error);
        }
        for (var i = 0; i < 10; i++) {
            console.log("---------------------")
            console.log("Tweet content: " + tweets[i].text)
            console.log("Created at: " + tweets[i].created_at)
            console.log("---------------------")
        };
    });
}

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

function movieSearch(query) {
    request("http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var root = JSON.parse(body);
            console.log("------------------");
            console.log("Title of Movie: " + root.Title);
            console.log("Year of Release: " + root.Year);
            console.log("IMDB Rating: " + root.imdbRating);
            //Work in logic for when there is no data for this
            console.log("Rotten Tomatoes Rating: " + root.Ratings[1].Value);
            console.log("Country Where Produced: " + root.Country);
            console.log("Language of Movie: " + root.Language);
            console.log("Plot of Movie: " + root.Plot);
            console.log("Actors in Movie: " + root.Actors);
            console.log("------------------");
        }
    });
}

function readFile() {
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            console.log(err);
        }
        dataArray = data.split(",")
        console.log(dataArray);
        liri(dataArray[0], dataArray[1]);
    });
}

function liri(command, searchTerm) {
    if (command === "my-tweets") {
        getTweets();
    } else {
        if (command === "spotify-this-song") {
            if (noInput && !readCommand) {
                spotifySearch("The Sign Ace of Base");
            } else {
                if (noInput && readCommand) {
                    spotifySearch(searchTerm)
                } else {
                    if (!noInput && readCommand) {
                        spotifySearch(searchTerm);
                    } else {
                        spotifySearch(term);
                    }
                }
            }
        } else {
            if (command === "movie-this") {
                if (noInput && !readCommand) {
                    process.argv.push("Mr. Nobody");
                    movieSearch(process.argv[3]);
                } else {
                    if (!noInput && readCommand) {
                        movieSearch(searchTerm);
                    } else {
                        movieSearch(term);
                    }
                }

            } else {
                if (command === "do-what-it-says") {
                    readCommand = true;
                    readFile();            
                }
            }
        }
    
    }

}

 
liri(command);