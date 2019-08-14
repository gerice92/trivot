var spotifyWebApi = require('spotify-web-api-node')
var fuzz = require('fuzzball');
const readline = require('readline')

//https://www.spotify.com/es/account/apps/ Aqui quito el acceso

//NEW
/* {
  "access_token": "BQAPMBajB0k19oT38O51d02kw2kMuN7cQ50DHqaikxew0TTra6Yn6rVAYCt4D6wwNg_nbMVpSLgrElcTUlQYMRibQ_A3U2uFxAXCnVMPvYmVQxMJoQQ6nlImIFUeYoNEOggD0RHUnf7tlkcqDQghNI1g9tfaROrDirZcdP4_3Qq1V78p7UUm",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "user-read-email user-read-private"
} */
var token = "BQA8kJ2poMiKrSc9kdOFDkeH0dHS1ddoOWRR1Idzu5rLun6Bh9SbYjcYLmkNZCGb4Fs6Y9nZKs3yjZ_RN6VaQOTnH6R508Dn2XVP3qRm6eqwRwCmJuav7UX710I_HjAw5IiReodd-FnDJIljWYjZVjMbWfwOShrE2CziWqyhCA98iI4jGhyq"
var refresh_token = "AQCrViCNqF2J47uV89oqZCKkQISe37qdMiQ2hoW_4iYdipJf6SBRPuBxiAmXW5fYdqfnJLWL2WCed-zjf8ClNxzkVCO1D7ojIW0UiDz-WN3SrlexsndXsraFQ1bMVrPwvqrolQ"
var spotifyApi = new spotifyWebApi({
    clientId: '3d9a647522584be0a6f708143248deca',
    clientSecret: '77c2b0565edc48188b3d42e7781c7861',
    redirectUri: 'http://localhost:8888/callback/'
  });
spotifyApi.setAccessToken(token);

const fs = require('fs');
let rawdata = fs.readFileSync('predefined_list.json');  
let playlistList = JSON.parse(rawdata);  

var getCategories = (filter) => {
  if (filter) {
    var filterType = playlistList.find( (playlist) => {
        return playlist.filter == filter
        })
      }
  return filterType.categories
}

var getPreviewsFromCategory = async (filter, category) => {
  var songList = [];
  if (filter && category) {
    var filterType = playlistList.find( (playlist) => {
        return playlist.filter == filter
        })
    
    var categories = filterType.categories
    var categoryPlaylist = categories.find( (cats) => {
      return cats.type == category
    })

    //console.log(categoryPlaylist)

    var data = await spotifyApi.getPlaylist(categoryPlaylist.link)
        //spotifyApi.searchPlaylists('All Out 70s').then(  
        //function(data) {
          //console.log('Artist albums', data.body);
          data.body.tracks.items.forEach(item => {
            var track = item.track.album.name
            var artist = item.track.album.artists
            var songURL = item.track.preview_url
            var popularity = item.track.popularity
            if (songURL){
              songList.push({
                track,
                artist,
                songURL,
                popularity
              })
            } 
          })

          return songList
  }
}

var selectSong = (songList) => {
  var idSong = Math.floor(Math.random()*songList.length)
  //console.log(songList[idSong])
  return songList[idSong]
}


var userFilterSelection = "genre";
var userCategorySelection = "Pop";

var printOutput = async () => {

    var filter = await ask(`¿Como quieres jugar? (género o década)`)
    //var categories = getCategories(filter)
    var category = await ask(`¿Que categoría?`)
      console.log(filter + " " + category)
      var songList = await getPreviewsFromCategory(filter, category);
      console.log("\nJugaremos una partida de 3 rondas.  ¡Empecemos!")
      for (var i = 0; i < 3; i++){
        var song = selectSong(songList)
        console.log("preview aquí ---> " + song.songURL)
        //console.log(song.artist[0].name)

        var singer = await ask(`${i+1}) ¿Quien canta?: `)
        var similarity = fuzz.token_set_ratio(singer, song.artist[0].name);

        if (similarity > 85){
          console.log("¡CORRECTO!")
        }else{
          console.log("¡FALLASTE! EL artista es " +  song.artist[0].name)
        }
        console.log()
      } 
      console.log("¡Gracias por jugar!")
      rl.close() 


}


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout

});

function ask(text) {
  return new Promise((resolve, reject) => {
    rl.question(`${text}: `, (input) => resolve(input) );
    
  });
}
printOutput()




