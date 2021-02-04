const userID = 'w8zzqofg0qzyeaw5nptn9fi3t';
const playlistId = '6qCbpzHdIEWoLJY9PF0rtD'; // actual one is 14M5jiWFCPq9bWpd6sUmDL
const clientId = 'df4fdffc7f5948d4bd55ec5edb828ae4';



const initPage = () => {
	setLoginURL();
	getToken();
}

const setLoginURL = () => {
    const scope = 'playlist-modify-public';
    // const redirectURL = 'https://thomasvirgo.github.io/';
    const redirectURL = 'https://postlockdownplaylist.github.io/home'
    const redirectURI = encodeURI(redirectURL);
    const loginURL = `https://accounts.spotify.com/en/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scope}&response_type=token`;
    const begin = document.getElementById('begin');
    begin.href = loginURL;
    console.log(loginURL);
}


const initTokenProcess = () => {
	const token = getToken();
	console.log(token)
}


const getToken = () => {
	const tokenURL = window.location.href;
	const myRegex = /\#(access_token)\=(\S*?)\&/;
	matchArr = tokenURL.match(myRegex);
	const token = matchArr[2];
	console.log(token);
	return token;
}



