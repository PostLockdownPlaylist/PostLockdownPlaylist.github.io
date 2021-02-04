document.addEventListener("readystatechange", (event)=>{
    if (event.target.readyState === "complete") {
        initApp()
    }
});


const userID = 'w8zzqofg0qzyeaw5nptn9fi3t';
const playlistId = '14M5jiWFCPq9bWpd6sUmDL'; // actual one is 14M5jiWFCPq9bWpd6sUmDL. 6qCbpzHdIEWoLJY9PF0rtD
const clientId = 'df4fdffc7f5948d4bd55ec5edb828ae4';
const currentToken = localStorage.getItem('token');


const initApp = async () => {
	// console.log('initiated');
	processPlaylist();
}



const processPlaylist = async () => {
    //clear stats line
    resultsArray = await getPlaylist();
    myResults = processResults(resultsArray);
    // console.log(myResults);
    buildPlaylist(myResults);
}



const buildPlaylist = (arr) => {
    // for each result in the result array, arr, do the folllowing (using an arrow function) ... 
    arr.forEach(result => {
        const resultItem = createResultItem(result);
        const resultContents = document.createElement("div"); // create a div element to store the search result
        resultContents.classList.add('resultContents'); // add a class resultContents to the div for styling purposes
        if (result.image) {
            const resultImage = createResultImage(result); 
            resultContents.append(resultImage);
        }
        const resultText = createResultText(result);
        resultContents.append(resultText);

        const resultPreview = createPreview(result);
        resultContents.append(resultPreview);

        resultItem.append(resultContents);
        const searchResults = document.getElementById('playlist');
        searchResults.append(resultItem);
    });
}

const createResultItem = (result) => {
    const resultItem = document.createElement('div'); //create a div for the result
    resultItem.classList.add('resultItem'); // add the class resultItem 
    return resultItem;    
}

const createResultImage = (result) => {
    const resultImage = document.createElement('div');
    resultImage.classList.add('resultImage');
    const img = document.createElement('img');
    img.src = result.image.url;
    img.alt = result.artists[0];
    img.height = 120;
    resultImage.append(img);
    return resultImage;
}


const createResultText = (result) => {
    const resultText = document.createElement('div');
    resultText.classList.add('resultText');
    const resultDescription = document.createElement('p');
    resultDescription.classList.add('resultDescription');
    let artistStr = '';
    for (let i=0; i<result.artists.length; i++){
        artistStr = artistStr + result.artists[i] + ', ';
    }
    artistStr = artistStr.slice(0, -2);
    resultDescription.textContent = `${result.songName} by ${artistStr}. Spotify popularity score: ${result.popularity}/100.`;
    resultText.append(resultDescription);
    return resultText;
}


const createPreview = (result) => {
    const resultPreview = document.createElement('div');
    resultPreview.classList.add('resultPreview');
    let resultPreviewSong = ''
    if (result.preview === null) {
        resultPreviewSong = document.createElement('p');
        resultPreviewSong.textContent = 'No preview available, sorry!';
    } else {
        resultPreviewSong = document.createElement('audio');
        resultPreviewSong.src = result.preview;
        resultPreviewSong.setAttribute('controls', "");
    }
        
    resultPreview.append(resultPreviewSong);
    return resultPreview;
}



const getPlaylist = async (searchTerm) => {
    //const token = await getToken() //once have login, will need to refresh the token every hour to keep it working...
    const rawsearchString = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    const searchString = encodeURI(rawsearchString); //encodes space etc..
    try {
        const result = await fetch(searchString, {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentToken}`,
            } // can find the headers required on the spotify api website
        });
        const data = await result.json();
        // console.log(data.items)
        return data.items;
        } catch (err) {
            console.error(err)
        }
    } 



function songEntry(name, artists, image, preview, popularity, songId) {
    this.songName = name;
    this.artists = artists;
    this.image = image;
    this.preview = preview;
    this.popularity = popularity;
    this.songId = songId;
}

const processResults = (arr) => {
    let showSongList = [];
    for (let i = 0; i<arr.length; i++) {
    	let track = arr[i].track;
        let artists = track.artists;
        let songArtists = [];
        for (let j =0; j<artists.length; j++) {
            songArtists.push(artists[j].name)
        }

        showSongList.push(new songEntry(track.name, songArtists, track.album.images[0], track.preview_url, track.popularity, track.id));
    }
    return showSongList;
}