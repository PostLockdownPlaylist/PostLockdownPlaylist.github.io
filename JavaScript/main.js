const userID = 'w8zzqofg0qzyeaw5nptn9fi3t';
const playlistId = '6qCbpzHdIEWoLJY9PF0rtD'; // actual one is 14M5jiWFCPq9bWpd6sUmDL
const clientId = 'df4fdffc7f5948d4bd55ec5edb828ae4';

const tokenURL = 'https://postlockdownplaylist.github.io/#access_token=BQDqUmcZHepyJGKnrDB13gVwQpfxIeYhMyQ2kJ9p45_SmLBntKT_TXSoJS0sGityHqc8NPAN9ThYooTTuaDMi4IK3fjfIC9RvI6G6lYhLXnGXswXUS7_iTf6_KzitLMR2mtbdFRy5snrAPKJxotDcGa5XwB-Jk6mYhrfr6lQe0pq9Xhu5pC8tQqc2pgFTrtid9rSBuaa_cNM&token_type=Bearer&expires_in=3600';


const initPage = () => {
	setLoginURL();
	getToken();
}

const setLoginURL = () => {
    const scope = 'playlist-modify-public';
    // const redirectURL = 'https://thomasvirgo.github.io/';
    const redirectURL = 'https://postlockdownplaylist.github.io/'
    const redirectURI = encodeURI(redirectURL);
    const loginURL = `https://accounts.spotify.com/en/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scope}&response_type=token`;
    const begin = document.getElementById('begin');
    begin.href = loginURL;
    console.log(loginURL);
}

const getToken = () => {
	const myRegex = /\#(access_token)\=(\S*?)\&/;
	matchArr = tokenURL.match(myRegex);
	const token = matchArr[2];
	console.log(token);
	console.log(window.location.href);
}



