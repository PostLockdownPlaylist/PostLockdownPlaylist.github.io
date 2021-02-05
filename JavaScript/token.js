const initTokenSequence = () => {
	console.log('initiated');
	const token = getToken();
	localStorage.setItem('token', token);
}


const getToken = () => {
	const tokenURL = window.location.href;
	const myRegex = /\#(access_token)\=(\S*?)\&/;
	matchArr = tokenURL.match(myRegex);
	const token = matchArr[2];
	return token;
}