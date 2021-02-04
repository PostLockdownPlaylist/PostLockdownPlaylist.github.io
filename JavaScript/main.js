const userID = 'w8zzqofg0qzyeaw5nptn9fi3t';
const playlistId = '14M5jiWFCPq9bWpd6sUmDL'; // actual one is 14M5jiWFCPq9bWpd6sUmDL. 6qCbpzHdIEWoLJY9PF0rtD
const clientId = 'df4fdffc7f5948d4bd55ec5edb828ae4';
const currentToken = localStorage.getItem('token');



const setLoginURL = () => {
    const scope = 'playlist-modify-public playlist-modify-private';
    const scopeURI = encodeURI(scope);
    const redirectURL = 'https://postlockdownplaylist.github.io/home'
    const redirectURI = encodeURI(redirectURL);
    const loginURL = `https://accounts.spotify.com/en/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scopeURI}&response_type=token`;
    const begin = document.getElementById('begin');
    begin.href = loginURL;
    console.log(loginURL);
}


const initApp = () => {
    setSearchFocus();

    const search = document.getElementById('search-input');
    search.addEventListener('input', showClearButton);

    const clear = document.getElementById('clear');
    clear.addEventListener('click', clearSearchText);

    // listens for when form is submitted and then runs the function submitTheSearch
    const form = document.getElementById("searchBar");
    form.addEventListener("submit", submitTheSearch);
    // If you add the backets after submitTheSearch, the function would execute straight away.
    // You're telling the addEventListener() which function to execute when the event is fired.
}




const showClearButton = () => {
    const search = document.getElementById('search-input');
    const clear = document.getElementById('clear');
    if (search.value.length) {
        clear.textContent = 'Clear Search Bar';
    } else {
        clear.textContent = "";
    }
}


const clearSearchText = (event) => {
    event.preventDefault();
    document.getElementById('search-input').value = '';
    const clear = document.getElementById('clear');
    clear.textContent = "";
    setSearchFocus();
}


const submitTheSearch = (event) => {
    // need to stop form reloading page when it is submitted, hence the preventDefault!
    event.preventDefault();
    // need to delete search results already existing
    deleteSearchResults();
    processTheSearch();
    setSearchFocus();
}


const deleteSearchResults = () => {
    const parentElement = document.getElementById('searchResults');
    let child = parentElement.lastElementChild;
    // keep removing the last entry until there are none left at which point child becomes empty and while condition evaulates to false
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
}


const processTheSearch = async () => {
    //clear stats line
    const playlist = await getPlaylist();
    // console.log(playlist);
    const searchTerm = getSearchTerm();
    if (searchTerm === '') return; // if search term is empty dont call the API therefore return early without processing rest of function
    const resultJson = await getSearchResults(searchTerm); // use await here because getSearchResults will be making a request to the spotify API
    // console.log(resultJson);
    let resultArray = [];
    if (resultJson.hasOwnProperty('tracks')) {
        resultArray = processResults(resultJson.tracks.items)
    }
    if (resultArray.length) buildSearchResults(resultArray, playlist);
}


const buildSearchResults = (arr, playlist) => {
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

        const addToPlaylist = createAddToPlaylist(result, playlist);
        resultContents.append(addToPlaylist);

        resultItem.append(resultContents);
        const searchResults = document.getElementById('searchResults');
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


const createAddToPlaylist = (result, playlist) => {
    songId = result.songId;
    // console.log(songId);
    // const addForm = document.createElement('form');
    // addForm.classList.add('addButton');
    // const addButton = document.createElement('button');
    // addButton.setAttribute('type', 'submit');
    // addButton.setAttribute('class', 'add-button');
    if (isInPlaylist(songId, playlist)) {
        const myText = document.createElement('p');
        myText.classList.add('in-playlist');
        myText.textContent = 'Already in Playlist.'
        // console.log('in playlist');
        return myText;
    } else {
        // console.log('not in playlist');
        const addForm = document.createElement('form');
        addForm.classList.add('addButton');
        const addButton = document.createElement('button');
        addButton.setAttribute('type', 'submit');
        addButton.setAttribute('class', 'add-button');
        addButton.textContent = 'Add to Playlist!';
        addButton.setAttribute('id', songId); // this is such that can add the right song to playlist when it is clicked!
        addForm.append(addButton);
        addButton.addEventListener('click', addButtonSubmitted);
        return addForm
    }
}


const addButtonSubmitted = async (event) => {
    event.preventDefault();
    const songId = event.srcElement.id;
    const songAPI = `spotify:track:${songId}`;
    const songIdUri = encodeURI(songAPI);
    // console.log(songId);
    const postStr = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${songIdUri}`;
    try {
    const result = await fetch(postStr, {
    method: 'POST',
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${currentToken}`,
        } // can find the headers required on the spotify api website
    });
    const data = await result.json();
    // console.log(data);
    const buttonClicked = document.getElementById(songId);
    buttonClicked.textContent = 'Song Added!';
    buttonClicked.removeEventListener('click', addButtonSubmitted);
    buttonClicked.classList.remove('add-button');
    buttonClicked.setAttribute('type', '');
    } catch (err) {
        console.error(err)
    }

}

//function to check if a song is already in the playlist
const isInPlaylist = (songId, playlist) => {
    for (let i = 0; i<playlist.length; i++){
        if (playlist[i].track.id == songId) {return true;}
    }   
    return false;
}
    

// constructor function for each song entry!
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

        let artists = arr[i].artists
        let songArtists = [];
        for (let j =0; j<artists.length; j++) {
            songArtists.push(artists[j].name)
        }

        showSongList.push(new songEntry(arr[i].name, songArtists, arr[i].album.images[0], arr[i].preview_url, arr[i].popularity, arr[i].id))
    }
    // console.log(showSongList);
    return showSongList;
}


const getSearchResults = async (searchTerm) => {
    //const token = await getToken() //once have login, will need to refresh the token every hour to keep it working...
    const rawsearchString = `https://api.spotify.com/v1/search?query=${searchTerm}&type=track&offset=0&limit=10`; //searchs for 10 top tracks
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
        // console.log(data)
        return data;
        } catch (err) {
            console.error(err)
        }
    } 


const setSearchFocus = () => {
    document.getElementById("search-input").focus();
}

const getSearchTerm = () => {
    const rawSearchTerm = document.getElementById('search-input').value.trim() //remove white spaces on edges
    const myRegex = /\s{2,}/gi; // look for accidental double spaces
    const searchTerm = rawSearchTerm.replaceAll(myRegex, ' ');  // replace with single space
    return searchTerm;
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









