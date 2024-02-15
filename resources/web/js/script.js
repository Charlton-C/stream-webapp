var websiteBrandImage = document.querySelector(".navbar-brand");
var navbarForm = document.querySelector(".navbar-form");
var navbarFormTextInput = document.querySelector(".navbar-form-text-input");
var navbarFormSubmitButton = document.querySelector(".navbar-form-submit-button");
var homePageLinkButton = document.querySelector(".home-page-link-button");
var songsPageLinkButton = document.querySelector(".songs-page-link-button");
var albumsPageLinkButton = document.querySelector(".albums-page-link-button");
var artistsPageLinkButton = document.querySelector(".artists-page-link-button");
var songsPreviewsDivUl = document.querySelector(".songs-previews-div-ul");
var albumsPreviewsDivUl = document.querySelector(".albums-previews-div-ul");
var expandSongsPreviewsDiv = document.querySelector(".expand-songs-previews-div");
var expandAlbumsPreviewsDiv = document.querySelector(".expand-albums-previews-div");
var songsListDivUl = document.querySelector(".songs-list-div-ul");
var albumsListDivUl = document.querySelector(".albums-list-div-ul");
var specificAlbumDivOl = document.querySelector(".specific-album-div-ol");
var searchInputTextDisplay = document.querySelector(".search-input-text-display");
var searchResultsDiv = document.querySelector(".search-results-div");
var songsSearchResultsDivUl = document.querySelector(".songs-search-results-div-ul");
var albumsSearchResultsDivUl = document.querySelector(".albums-search-results-div-ul");
var songPlayerSongNameH5 = document.querySelector(".song-player-song-name");
var songPlayerArtistNameH6 = document.querySelector(".song-player-artist-name");
var songPlayerSongNameH5 = document.querySelector(".song-player-song-name");
var songPlayerArtistNameH6 = document.querySelector(".song-player-artist-name");
var songPlayerElapsedTimeSpan = document.querySelector(".song-player-elapsed-time-span");
var songPlayerProgressBar = document.querySelector(".song-player-progress-bar");
var songPlayerRemainingTimeSpan = document.querySelector(".song-player-remaining-time-span");
var downloadCurrentSongButton = document.querySelector(".download-current-song-button");
var goToPreviousSongButton = document.querySelector(".go-to-previous-song-button");
var playOrPauseCurrentSongButton = document.querySelector(".play-or-pause-current-song-button");
var goToNextSongButton = document.querySelector(".go-to-next-song-button");
var songAudiosDictionary = {};
var albumsArray = [];
var playingAlbumQueue = [];
var isASongPlaying = false;
var isCurrentPlayingSongPlayingFromAnAlbum;
var updateSongProgressInterval = null;
var playingSongNumber = 1;
var numberOfSongs = 25;
var numberOfAlbums;



// Load songs after 15 seconds
setTimeout(() => {
	for(let i = 1; i <= numberOfSongs; i++){
		if(songAudiosDictionary[i] === undefined){
			songAudiosDictionary[i] = new Audio("/songs/128kbps/"+i.toString()+".mp3");
		}
	}
}, 15000);

// Get the number of albums
numberOfAlbums = Object.keys(albumsInfo).length;

// Add album names and album index to the albumsArray
for(let key in albumsInfo){
	albumsArray.push([key, albumsInfo[key]]);
}


// Function to create the song previews when the website loads
function createSongsPreviews(){
	let numberOfSongPreviewsToMake;
	if(numberOfSongs >= 20){ numberOfSongPreviewsToMake = 20; }
	else{ numberOfSongPreviewsToMake = numberOfSongs; }
	for(let songNumber = 1; songNumber <= numberOfSongPreviewsToMake; songNumber++){
		let liElement = document.createElement("li");
		liElement.setAttribute("class", "song-"+songNumber+"-preview-li");
		let liElementDiv = document.createElement("div");
		liElementDiv.setAttribute("class", "image-and-image_play-container");
		let liElementDivImg = document.createElement("img");
		liElementDivImg.setAttribute("class", "rounded");
		liElementDivImg.setAttribute("src", "/resources/images/songImages/"+songNumber+".png");
		liElementDivImg.onerror = () => {
			liElementDivImg.src = "/resources/images/songImages/"+songNumber+".jpeg";
		};
		let liElementDivSpan = document.createElement("span");
		liElementDivSpan.setAttribute("class", "bi-play-fill bi-pause-fill");
		liElementDiv.appendChild(liElementDivImg);
		liElementDiv.appendChild(liElementDivSpan);
		let liElementH5 = document.createElement("h5");
		liElementH5.setAttribute("class", "song-"+songNumber+"-song-name");
		liElementH5.innerText = songsInfo[songNumber.toString()][0];
		let liElementH6 = document.createElement("h6");
		liElementH6.setAttribute("class", "song-"+songNumber+"-artist-name");
		liElementH6.innerText = songsInfo[songNumber.toString()][1];			
		liElement.appendChild(liElementDiv);
		liElement.appendChild(liElementH5);
		liElement.appendChild(liElementH6);
		liElement.addEventListener("click", () => { songLiElementClickEventListener(songNumber, false, 0); });
		songsPreviewsDivUl.appendChild(liElement);
	}
}
createSongsPreviews();


// Function to create the albums previews when the website loads
function createAlbumsPreviews(){
	let numberOfAlbumPreviewsToMake;
	if(numberOfAlbums >= 20){ numberOfAlbumPreviewsToMake = 20; }
	else{ numberOfAlbumPreviewsToMake = numberOfAlbums; }
	for(let albumNumber = 1; albumNumber <= numberOfAlbumPreviewsToMake; albumNumber++){
		let liElement = document.createElement("li");
		liElement.setAttribute("class", "album-"+albumNumber+"-preview-li");
		let liElementImg = document.createElement("img");
		liElementImg.setAttribute("class", "rounded");
		liElementImg.setAttribute("src", "/resources/images/albumImages/"+albumNumber+".png");
		liElementImg.onerror = () => {
			liElementImg.src = "/resources/images/albumImages/"+albumNumber+".jpeg";
		};
		let liElementH5 = document.createElement("h5");
		liElementH5.setAttribute("class", "album-"+albumNumber+"-album-name");
		liElementH5.innerText = albumsArray[albumNumber-1][0];
		let liElementH6 = document.createElement("h6");
		liElementH6.setAttribute("class", "album-"+albumNumber+"-artist-name");
		liElementH6.innerText = albumsArray[albumNumber-1][1][0];
		liElement.appendChild(liElementImg);
		liElement.appendChild(liElementH5);
		liElement.appendChild(liElementH6);

		// Add click event listener for the album previews to open the album page when clicked
		liElement.addEventListener("click", () => {
			let albumNumber = (Number(liElement.classList[0].replace(/\D/g, "")));
			specificAlbumDivOl.innerHTML = "";
			document.querySelector("#music_previews_page").style.display = "none";
			document.querySelector("#specific_album_page").style.display = "block";
			document.querySelector(".specific-album-image").src = liElementImg.src;
			document.querySelector(".specific-album-name").innerText = albumsArray[albumNumber-1][0];
			document.querySelector(".specific-album-artist-name").innerText = albumsArray[albumNumber-1][1][0];

			// To arrange song li elements according to track number
			let albumSongsLiElementsDict = {};
			// Load the songs on the album page
			for(let i = 0; i < (albumsArray[albumNumber-1][1][1]).length; i++){
				let songTrackNumberInAlbum = albumsArray[albumNumber-1][1][2][i];
				let songNumber = albumsArray[albumNumber-1][1][1][i];
				let liElement = document.createElement("li");
				liElement.setAttribute("class", "song-"+songNumber+"-in-specific-album-song-li-from-songs-list song-"+(songTrackNumberInAlbum)+"-in-specific-album-song-li");
				let liElementDiv1 = document.createElement("div");
				liElementDiv1.setAttribute("class", "specific-album-songs-li-image-container");
				let liElementDiv1Img = document.createElement("img");
				liElementDiv1Img.setAttribute("src", "/resources/images/songImages/"+songNumber+".png");
				liElementDiv1Img.onerror = () => {
					liElementDiv1Img.src = "/resources/images/songImages/"+songNumber+".jpeg";
				};
				liElementDiv1.appendChild(liElementDiv1Img);
				let liElementDiv2 = document.createElement("div");
				liElementDiv2.setAttribute("class", "specific-album-songs-li-text-container");
				let liElementDiv2H5 = document.createElement("h5");
				liElementDiv2H5.setAttribute("class", "song-"+songNumber+"-song-name song-"+(songTrackNumberInAlbum)+"-specific-album-songs-name");
				liElementDiv2H5.innerText = songsInfo[songNumber.toString()][0];
				let liElementDiv2H6 = document.createElement("h6");
				liElementDiv2H6.setAttribute("class", "song-"+songNumber+"-artist-name song-"+(songTrackNumberInAlbum)+"-specific-album-songs-artist-name");
				liElementDiv2H6.innerText = songsInfo[songNumber.toString()][1];
				liElementDiv2.appendChild(liElementDiv2H5);
				liElementDiv2.appendChild(liElementDiv2H6);
				let liElementDiv3 = document.createElement("div");
				liElementDiv3.setAttribute("class", "specific-album-songs-li-button-container");
				let liElementDiv3Button = document.createElement("button");
				liElementDiv3Button.setAttribute("class", "btn bi-play-fill bi-pause-fill");
				liElementDiv3.appendChild(liElementDiv3Button);
				liElement.appendChild(liElementDiv1);
				liElement.appendChild(liElementDiv2);
				liElement.appendChild(liElementDiv3);
				liElement.style.setProperty("--track-number-for-album", `"${songTrackNumberInAlbum.toString()}"`);
				liElement.addEventListener("click", () => { songLiElementClickEventListener(songNumber, true, albumNumber); });
				albumSongsLiElementsDict[songTrackNumberInAlbum] = liElement;
			}
			// To arrange song li elements according to track number
			let sortedAlbumTrackNumberArray = (Object.keys(albumSongsLiElementsDict)).sort((a, b) => a - b);
			for(let i = 0; i < sortedAlbumTrackNumberArray.length; i++) {
				specificAlbumDivOl.appendChild(albumSongsLiElementsDict[sortedAlbumTrackNumberArray[i]]);
			}


			// To change the play, pause status of a song in the album if the song is playing
			if(isASongPlaying == true && document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
				if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
		});


		albumsPreviewsDivUl.appendChild(liElement);
	}
}
createAlbumsPreviews();


// Function to create the song list when the website loads
function createSongsLiInSongsListPage(){
	songsListDivUl.innerHTML = "";
	for(let songNumber = 1; songNumber <= numberOfSongs; songNumber++){
		let liElement = document.createElement("li");
		liElement.setAttribute("class", "song-"+songNumber+"-song-list-li");
		let liElementDiv1 = document.createElement("div");
		liElementDiv1.setAttribute("class", "song-list-song-li-image-container");
		let liElementDiv1Img = document.createElement("img");
		liElementDiv1Img.setAttribute("src", "/resources/images/songImages/"+songNumber+".png");
		liElementDiv1Img.onerror = () => {
			liElementDiv1Img.src = "/resources/images/songImages/"+songNumber+".jpeg";
		};
		liElementDiv1.appendChild(liElementDiv1Img);
		let liElementDiv2 = document.createElement("div");
		liElementDiv2.setAttribute("class", "song-list-song-li-text-container");
		let liElementDiv2H5 = document.createElement("h5");
		liElementDiv2H5.setAttribute("class", "song-"+songNumber+"-song-name");
		liElementDiv2H5.innerText = songsInfo[songNumber.toString()][0];
		let liElementDiv2H6 = document.createElement("h6");
		liElementDiv2H6.setAttribute("class", "song-"+songNumber+"-artist-name");
		liElementDiv2H6.innerText = songsInfo[songNumber.toString()][1];
		liElementDiv2.appendChild(liElementDiv2H5);
		liElementDiv2.appendChild(liElementDiv2H6);
		let liElementDiv3 = document.createElement("div");
		liElementDiv3.setAttribute("class", "song-list-song-li-button-container");
		let liElementDiv3Button = document.createElement("button");
		liElementDiv3Button.setAttribute("class", "btn bi-play-fill bi-pause-fill");
		liElementDiv3.appendChild(liElementDiv3Button);
		liElement.appendChild(liElementDiv1);
		liElement.appendChild(liElementDiv2);
		liElement.appendChild(liElementDiv3);
		liElement.addEventListener("click", () => { songLiElementClickEventListener(songNumber, false, 0); });
		songsListDivUl.appendChild(liElement);
	}
}


// Function to create the albums previews when the website loads
function createAlbumsListPreviews(){
	albumsListDivUl.innerHTML = "";
	for(let albumNumber = 1; albumNumber <= numberOfAlbums; albumNumber++){
		let liElement = document.createElement("li");
		liElement.setAttribute("class", "album-"+albumNumber+"-preview-li");
		let liElementImg = document.createElement("img");
		liElementImg.setAttribute("class", "rounded");
		liElementImg.setAttribute("src", "/resources/images/albumImages/"+albumNumber+".png");
		liElementImg.onerror = () => {
			liElementImg.src = "/resources/images/albumImages/"+albumNumber+".jpeg";
		};
		let liElementH5 = document.createElement("h5");
		liElementH5.setAttribute("class", "album-"+albumNumber+"-album-name");
		liElementH5.innerText = albumsArray[albumNumber-1][0];
		let liElementH6 = document.createElement("h6");
		liElementH6.setAttribute("class", "album-"+albumNumber+"-artist-name");
		liElementH6.innerText = albumsArray[albumNumber-1][1][0];
		liElement.appendChild(liElementImg);
		liElement.appendChild(liElementH5);
		liElement.appendChild(liElementH6);

		// Add click event listener for the album previews to open the album page when clicked
		liElement.addEventListener("click", () => {
			let albumNumber = (Number(liElement.classList[0].replace(/\D/g, "")));
			specificAlbumDivOl.innerHTML = "";
			document.querySelector("#albums_list_page").style.display = "none";
			document.querySelector("#specific_album_page").style.display = "block";
			document.querySelector(".specific-album-image").src = liElementImg.src;
			document.querySelector(".specific-album-name").innerText = albumsArray[albumNumber-1][0];
			document.querySelector(".specific-album-artist-name").innerText = albumsArray[albumNumber-1][1][0];

			// To arrange song li elements according to track number
			let albumSongsLiElementsDict = {};
			// Load the songs on the album page
			for(let i = 0; i < (albumsArray[albumNumber-1][1][1]).length; i++){
				let songTrackNumberInAlbum = albumsArray[albumNumber-1][1][2][i];
				let songNumber = albumsArray[albumNumber-1][1][1][i];
				let liElement = document.createElement("li");
				liElement.setAttribute("class", "song-"+songNumber+"-in-specific-album-song-li-from-songs-list song-"+(songTrackNumberInAlbum)+"-in-specific-album-song-li");
				let liElementDiv1 = document.createElement("div");
				liElementDiv1.setAttribute("class", "specific-album-songs-li-image-container");
				let liElementDiv1Img = document.createElement("img");
				liElementDiv1Img.setAttribute("src", "/resources/images/songImages/"+songNumber+".png");
				liElementDiv1Img.onerror = () => {
					liElementDiv1Img.src = "/resources/images/songImages/"+songNumber+".jpeg";
				};
				liElementDiv1.appendChild(liElementDiv1Img);
				let liElementDiv2 = document.createElement("div");
				liElementDiv2.setAttribute("class", "specific-album-songs-li-text-container");
				let liElementDiv2H5 = document.createElement("h5");
				liElementDiv2H5.setAttribute("class", "song-"+songNumber+"-song-name song-"+(songTrackNumberInAlbum)+"-specific-album-songs-name");
				liElementDiv2H5.innerText = songsInfo[songNumber.toString()][0];
				let liElementDiv2H6 = document.createElement("h6");
				liElementDiv2H6.setAttribute("class", "song-"+songNumber+"-artist-name song-"+(songTrackNumberInAlbum)+"-specific-album-songs-artist-name");
				liElementDiv2H6.innerText = songsInfo[songNumber.toString()][1];
				liElementDiv2.appendChild(liElementDiv2H5);
				liElementDiv2.appendChild(liElementDiv2H6);
				let liElementDiv3 = document.createElement("div");
				liElementDiv3.setAttribute("class", "specific-album-songs-li-button-container");
				let liElementDiv3Button = document.createElement("button");
				liElementDiv3Button.setAttribute("class", "btn bi-play-fill bi-pause-fill");
				liElementDiv3.appendChild(liElementDiv3Button);
				liElement.appendChild(liElementDiv1);
				liElement.appendChild(liElementDiv2);
				liElement.appendChild(liElementDiv3);
				liElement.style.setProperty("--track-number-for-album", `"${songTrackNumberInAlbum.toString()}"`);
				liElement.addEventListener("click", () => { songLiElementClickEventListener(songNumber, true, albumNumber); });
				albumSongsLiElementsDict[songTrackNumberInAlbum] = liElement;
			}
			// To arrange song li elements according to track number
			let sortedAlbumTrackNumberArray = (Object.keys(albumSongsLiElementsDict)).sort((a, b) => a - b);
			for(let i = 0; i < sortedAlbumTrackNumberArray.length; i++) {
				specificAlbumDivOl.appendChild(albumSongsLiElementsDict[sortedAlbumTrackNumberArray[i]]);
			}


			// To change the play, pause status of a song in the album if the song is playing
			if(isASongPlaying == true && document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
				if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
		});


		albumsListDivUl.appendChild(liElement);
	}
}

function songLiElementClickEventListener(songNumber, isSongLiElementFromAlbum, albumNumber){
	if(songAudiosDictionary[songNumber] != undefined){
		songLiElementClickEventListenerPlayOrPauseFunction();
	}
	else if(songAudiosDictionary[songNumber] === undefined){
		songAudiosDictionary[songNumber] = new Audio("/songs/128kbps/"+songNumber.toString()+".mp3");
		setTimeout(() => { songLiElementClickEventListenerPlayOrPauseFunction(); }, 1000);
	}
	else{}

	function songLiElementClickEventListenerPlayOrPauseFunction() {
		songPlayerSongNameH5.innerText = songsInfo[songNumber.toString()][0];
		songPlayerArtistNameH6.innerText = songsInfo[songNumber.toString()][1];

		// Change image play or pause button to show whether a song is playing
		// To play the first song or to play a different song while the previous one is paused				
		if(isASongPlaying == false && playingSongNumber != songNumber){
			if(document.querySelector(".song-"+songNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
				if(document.querySelector(".song-"+songNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+songNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+songNumber+"-song-list-li")){
				if(document.querySelector(".song-"+songNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+songNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+songNumber+"-in-specific-album-song-li-from-songs-list")){
				if(document.querySelector(".song-"+songNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+songNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(document.querySelector(".song-"+songNumber+"-song-result-li")){
				if(document.querySelector(".song-"+songNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+songNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(playOrPauseCurrentSongButton.classList.contains("bi-play")){
				playOrPauseCurrentSongButton.classList.toggle("bi-play");
			}
			songAudiosDictionary[songNumber].currentTime = 0;
			playOrPauseSong(songNumber, 1);
			updateSongProgress(songNumber, 1);
			isASongPlaying = true;
		}
		// To continue to play the same song
		else if(isASongPlaying == false && playingSongNumber == songNumber){
			if(document.querySelector(".song-"+songNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
				if(document.querySelector(".song-"+songNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+songNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+songNumber+"-song-list-li")){
				if(document.querySelector(".song-"+songNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+songNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+songNumber+"-in-specific-album-song-li-from-songs-list")){
				if(document.querySelector(".song-"+songNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+songNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(document.querySelector(".song-"+songNumber+"-song-result-li")){
				if(document.querySelector(".song-"+songNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+songNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(playOrPauseCurrentSongButton.classList.contains("bi-play")){
				playOrPauseCurrentSongButton.classList.toggle("bi-play");
			}
			playOrPauseSong(songNumber, 1);
			updateSongProgress(songNumber, 1);
			isASongPlaying = true;
		}
		// To play a different song while another one is still playing (pause the other one)
		else if(isASongPlaying == true && playingSongNumber != songNumber){
			if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
				if(!document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
				if(!document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(document.querySelector(".song-"+songNumber+"-song-result-li")){
				if(!document.querySelector(".song-"+songNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+songNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(document.querySelector(".song-"+songNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
				if(document.querySelector(".song-"+songNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+songNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+songNumber+"-song-list-li")){
				if(document.querySelector(".song-"+songNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+songNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+songNumber+"-in-specific-album-song-li-from-songs-list")){
				if(document.querySelector(".song-"+songNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+songNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(document.querySelector(".song-"+songNumber+"-song-result-li")){
				if(document.querySelector(".song-"+songNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+songNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			playOrPauseSong(playingSongNumber, 0);
			updateSongProgress(playingSongNumber, 0);
			songAudiosDictionary[songNumber].currentTime = 0;
			playOrPauseSong(songNumber, 1);
			updateSongProgress(songNumber, 1);
		}
		// To pause a song
		else if(isASongPlaying == true && playingSongNumber == songNumber){
			if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
				if(!document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
				if(!document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(document.querySelector(".song-"+songNumber+"-song-result-li")){
				if(!document.querySelector(".song-"+songNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+songNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(!playOrPauseCurrentSongButton.classList.contains("bi-play")){
				playOrPauseCurrentSongButton.classList.toggle("bi-play");
			}
			playOrPauseSong(playingSongNumber, 0);
			updateSongProgress(playingSongNumber, 0);
			isASongPlaying = false;
		}
		else{}

		playingSongNumber = songNumber;
		if(isSongLiElementFromAlbum == false){
			isCurrentPlayingSongPlayingFromAnAlbum = false;
			playingAlbumQueue = [];
		}
		else if(isSongLiElementFromAlbum == true){
			isCurrentPlayingSongPlayingFromAnAlbum = true;
			// To make the next songs that play to come from the same album
			for(let numberOfSongsToAddToPlayingAlbumQueue = 0; numberOfSongsToAddToPlayingAlbumQueue < (albumsArray[albumNumber-1][1]).length; numberOfSongsToAddToPlayingAlbumQueue++){
				playingAlbumQueue = albumsArray[albumNumber-1][1][numberOfSongsToAddToPlayingAlbumQueue];
			}
		}
		else{}
	}
}


websiteBrandImage.addEventListener("click", goToHomePage);
homePageLinkButton.addEventListener("click", goToHomePage);
function goToHomePage(){
	document.querySelector("#songs_list_page").style.display = "none";
	document.querySelector("#albums_list_page").style.display = "none";
	document.querySelector("#specific_album_page").style.display = "none";
	document.querySelector("#search_results_page").style.display = "none";
	document.querySelector("#music_previews_page").style.display = "block";
	document.querySelector("title").innerText = "Music - Home";
	if(isASongPlaying == true && document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
		document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
	}
}

expandSongsPreviewsDiv.addEventListener("click", goToSongsListPage);
songsPageLinkButton.addEventListener("click", goToSongsListPage);
function goToSongsListPage(){
	document.querySelector("#music_previews_page").style.display = "none";
	document.querySelector("#albums_list_page").style.display = "none";
	document.querySelector("#specific_album_page").style.display = "none";
	document.querySelector("#search_results_page").style.display = "none";
	document.querySelector("#songs_list_page").style.display = "block";
	document.querySelector("title").innerText = "Music - Songs";
	createSongsLiInSongsListPage();
	if(isASongPlaying == true && document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
		document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");			
	}
}

expandAlbumsPreviewsDiv.addEventListener("click", goToAlbumsListPage);
albumsPageLinkButton.addEventListener("click", goToAlbumsListPage);
function goToAlbumsListPage(){
	document.querySelector("#music_previews_page").style.display = "none";
	document.querySelector("#songs_list_page").style.display = "none";
	document.querySelector("#specific_album_page").style.display = "none";
	document.querySelector("#search_results_page").style.display = "none";
	document.querySelector("#albums_list_page").style.display = "block";
	document.querySelector("title").innerText = "Music - Albums";
	createAlbumsListPreviews();
}

navbarFormSubmitButton.addEventListener("click", (e) => {
	e.preventDefault();
	let stringToSearch = escapeRegex(navbarFormTextInput.value);
	let songNameMatchSongNumberSearchResultsArray = [];
	let songArtistNameMatchSongNumberSearchResultsArray = [];

	// Get all songs with stringToSearch in their name
	for(let i = 1; i <= numberOfSongs; i++){
		if((songsInfo[i.toString()][0]).search(new RegExp(stringToSearch, "i")) != -1){
			songNameMatchSongNumberSearchResultsArray.push(i);
		}
	}
	// Get all song artists with stringToSearch in their name
	for(let i = 1; i <= numberOfSongs; i++){
		if((songsInfo[i.toString()][1]).search(new RegExp(stringToSearch, "i")) != -1){
			songArtistNameMatchSongNumberSearchResultsArray.push(i);
		}
	}

	// Change page being displayed
	document.querySelector("#music_previews_page").style.display = "none";
	document.querySelector("#songs_list_page").style.display = "none";
	document.querySelector("#specific_album_page").style.display = "none";
	document.querySelector("#albums_list_page").style.display = "none";
	document.querySelector("#search_results_page").style.display = "block";

	// Change website title
	document.querySelector("title").innerText = "Search results";


	songsSearchResultsDivUl.innerHTML = "";
	albumsSearchResultsDivUl.innerHTML = "";
	searchInputTextDisplay.innerText = navbarFormTextInput.value;
	
	
	if(songNameMatchSongNumberSearchResultsArray.length != 0 || songArtistNameMatchSongNumberSearchResultsArray.length != 0){
		// Merge the songNameMatchSongNumberSearchResultsArray and songArtistNameMatchSongNumberSearchResultsArray while removing duplicates
		let songNumberSearchResultsArray = Array.from(new Set(songNameMatchSongNumberSearchResultsArray.concat(songArtistNameMatchSongNumberSearchResultsArray)));

		// Show songs search results
		if(songNameMatchSongNumberSearchResultsArray.length != 0 || songArtistNameMatchSongNumberSearchResultsArray.length != 0){
			for(let i = 0; i < songNumberSearchResultsArray.length; i++){
				let liElement = document.createElement("li");
				liElement.setAttribute("class", "song-"+songNumberSearchResultsArray[i]+"-song-result-li");
				let liElementDiv1 = document.createElement("div");
				liElementDiv1.setAttribute("class", "song-result-song-li-image-container");
				let liElementDiv1Img = document.createElement("img");
				liElementDiv1Img.setAttribute("src", "/resources/images/songImages/"+songNumberSearchResultsArray[i]+".png");
				liElementDiv1Img.onerror = () => {
					liElementDiv1Img.src = "/resources/images/songImages/"+songNumberSearchResultsArray[i]+".jpeg";
				};
				liElementDiv1.appendChild(liElementDiv1Img);
				let liElementDiv2 = document.createElement("div");
				liElementDiv2.setAttribute("class", "song-result-song-li-text-container");
				let liElementDiv2H5 = document.createElement("h5");
				liElementDiv2H5.setAttribute("class", "song-"+songNumberSearchResultsArray[i]+"-result-song-name");
				liElementDiv2H5.innerText = songsInfo[songNumberSearchResultsArray[i].toString()][0];
				let liElementDiv2H6 = document.createElement("h6");
				liElementDiv2H6.setAttribute("class", "song-"+songNumberSearchResultsArray[i]+"-result-artist-name");
				liElementDiv2H6.innerText = songsInfo[songNumberSearchResultsArray[i].toString()][1];
				liElementDiv2.appendChild(liElementDiv2H5);
				liElementDiv2.appendChild(liElementDiv2H6);
				let liElementDiv3 = document.createElement("div");
				liElementDiv3.setAttribute("class", "song-result-song-li-button-container");
				let liElementDiv3Button = document.createElement("button");
				liElementDiv3Button.setAttribute("class", "btn bi-play-fill bi-pause-fill");
				liElementDiv3.appendChild(liElementDiv3Button);
				liElement.appendChild(liElementDiv1);
				liElement.appendChild(liElementDiv2);
				liElement.appendChild(liElementDiv3);
				liElement.addEventListener("click", () => { songLiElementClickEventListener(songNumberSearchResultsArray[i], false, 0); });
				songsSearchResultsDivUl.appendChild(liElement);

				// To change the play, pause status of a song in the results if the song is playing
				if(isASongPlaying == true && document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
			}
		}
	}
	else if(songNameMatchSongNumberSearchResultsArray.length == 0 && songArtistNameMatchSongNumberSearchResultsArray.length == 0){ songsSearchResultsDivUl.innerText = "No matches found"; }
	else{ searchResultsDiv.innerHTML = "An error occurred"; }
});
function escapeRegex(string){
	return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
}


// Change current song position when the user slides the current playing song slider
songPlayerProgressBar.addEventListener("change", ()=>{
	// To pause the song
	playOrPauseSong(playingSongNumber, 0);
	updateSongProgress(playingSongNumber, 0);
	isASongPlaying = false;
	// To change the time of the song to the time the user has slide the slider to
	songAudiosDictionary[playingSongNumber].currentTime = Math.floor((songPlayerProgressBar.value/100)*songAudiosDictionary[playingSongNumber].duration);
	// To continue to play the song from the new position
	playOrPauseSong(playingSongNumber, 1);
	updateSongProgress(playingSongNumber, 1);
	isASongPlaying = true;
});

// Function to change the current song progress info every second
function updateSongProgress(playingSongNumber, turnOnOrOff){
	let currentSong = songAudiosDictionary[playingSongNumber];
	if(turnOnOrOff == 1){
		updateSongProgressInterval = setInterval(()=>{
			updateSongProgressBar(currentSong);
			updateSongElapsedAndRemainingTime(currentSong);
			playNextSongWhenCurrentSongEnds(currentSong);
		}, 850);
	}
	else if(turnOnOrOff == 0){
		clearInterval(updateSongProgressInterval);
	}
	else{}
};


// Go to the previous song button function
goToPreviousSongButton.addEventListener("click", () => {
	// No song plays as the user has not selected a song
	if(songPlayerSongNameH5.innerText == ""){}
	// To play the previous song when the user is listening to the currently playing song which isn't playing from an album
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == true && isCurrentPlayingSongPlayingFromAnAlbum == false){
		if(playingSongNumber > 1){
			// To pause the current playing song
			if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
				if(!document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
				if(!document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			playOrPauseSong(playingSongNumber, 0);
			updateSongProgress(playingSongNumber, 0);
			isASongPlaying = false;
			// To play the previous song
			if(isCurrentPlayingSongPlayingFromAnAlbum == true){
				if(playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))-1] != undefined){
					playingSongNumber = playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))-1];
				}
			}
			else if(isCurrentPlayingSongPlayingFromAnAlbum == false){
				playingSongNumber = Number(playingSongNumber) - 1;
			}
			else{}
			// To load the previous song if it is not loaded
			if(songAudiosDictionary[playingSongNumber] != undefined){
				playPreviousSong();
			}
			else if(songAudiosDictionary[playingSongNumber] === undefined){
				songAudiosDictionary[playingSongNumber] = new Audio("/songs/128kbps/"+playingSongNumber.toString()+".mp3");
				setTimeout(() => { playPreviousSong(); }, 1000);
			}
			else{}
			function playPreviousSong(){
				songAudiosDictionary[playingSongNumber].currentTime = 0;
				if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
					if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
					if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
				songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
				playOrPauseSong(playingSongNumber, 1);
				updateSongProgress(playingSongNumber, 1);
				isASongPlaying = true;
			}
		}
		// To restart the song playing when it is the first song available on the songs list
		else if(playingSongNumber == 1){
			// To load the first song if it is not loaded
			if(songAudiosDictionary[playingSongNumber] != undefined){
				songAudiosDictionary[playingSongNumber].currentTime = 0;
			}
			else if(songAudiosDictionary[playingSongNumber] === undefined){
				songAudiosDictionary[playingSongNumber] = new Audio("/songs/128kbps/"+playingSongNumber.toString()+".mp3");
				setTimeout(() => { songAudiosDictionary[playingSongNumber].currentTime = 0; }, 1000);
			}
			else{}
		}
		else{}
	}
	// To play the previous song when the user is listening to the currently playing song which is playing from an album
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == true && isCurrentPlayingSongPlayingFromAnAlbum == true){
		if(playingAlbumQueue.indexOf(playingSongNumber) > 0){
			// To pause and end the current song progress update
			if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
				if(!document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
				if(!document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			playOrPauseSong(playingSongNumber, 0);
			updateSongProgress(playingSongNumber, 0);
			isASongPlaying = false;
			// To play the previous song
			if(isCurrentPlayingSongPlayingFromAnAlbum == true){
				if(playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))-1] != undefined){
					playingSongNumber = playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))-1];
				}
			}
			else if(isCurrentPlayingSongPlayingFromAnAlbum == false){
				playingSongNumber = Number(playingSongNumber) - 1;
			}
			else{}
			// To load the previous song if it is not loaded
			if(songAudiosDictionary[playingSongNumber] != undefined){
				playPreviousSong();
			}
			else if(songAudiosDictionary[playingSongNumber] === undefined){
				songAudiosDictionary[playingSongNumber] = new Audio("/songs/128kbps/"+playingSongNumber.toString()+".mp3");
				setTimeout(() => { playPreviousSong(); }, 1000);
			}
			else{}
			function playPreviousSong(){
				songAudiosDictionary[playingSongNumber].currentTime = 0;
				if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
					if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
					if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
				songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
				playOrPauseSong(playingSongNumber, 1);
				updateSongProgress(playingSongNumber, 1);
				isASongPlaying = true;
			}
		}
		// To restart the song playing when it is the first song available on the album
		else if(playingAlbumQueue.indexOf(playingSongNumber) == 0){
			// To load the first song if it is not loaded
			if(songAudiosDictionary[playingSongNumber] != undefined){
				songAudiosDictionary[playingSongNumber].currentTime = 0;
			}
			else if(songAudiosDictionary[playingSongNumber] === undefined){
				songAudiosDictionary[playingSongNumber] = new Audio("/songs/128kbps/"+playingSongNumber.toString()+".mp3");
				setTimeout(() => { songAudiosDictionary[playingSongNumber].currentTime = 0; }, 1000);
			}
			else{}
		}
		else{}
	}
	// To play the previous song when the user isn't listening to the currently playing song which isn't playing from an album
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == false && isCurrentPlayingSongPlayingFromAnAlbum == false){
		if(playingSongNumber > 1){
			// To play the previous song
			if(isCurrentPlayingSongPlayingFromAnAlbum == true){
				if(playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))-1] != undefined){
					playingSongNumber = playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))-1];
				}
			}
			else if(isCurrentPlayingSongPlayingFromAnAlbum == false){
				playingSongNumber = Number(playingSongNumber) - 1;
			}
			else{}
			// To load the previous song if it is not loaded
			if(songAudiosDictionary[playingSongNumber] != undefined){
				playPreviousSong();
			}
			else if(songAudiosDictionary[playingSongNumber] === undefined){
				songAudiosDictionary[playingSongNumber] = new Audio("/songs/128kbps/"+playingSongNumber.toString()+".mp3");
				setTimeout(() => { playPreviousSong(); }, 1000);
			}
			else{}
			function playPreviousSong(){
				songAudiosDictionary[playingSongNumber].currentTime = 0;
				if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
					if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
					if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				if(playOrPauseCurrentSongButton.classList.contains("bi-play")){
					playOrPauseCurrentSongButton.classList.toggle("bi-play");
				}
				songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
				songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
				playOrPauseSong(playingSongNumber, 1);
				updateSongProgress(playingSongNumber, 1);
				isASongPlaying = true;
			}
		}
		// To restart the song when it is the first song available on the songs list
		else if(playingSongNumber == 1){
			// To load the first song if it is not loaded
			if(songAudiosDictionary[playingSongNumber] != undefined){
				songAudiosDictionary[playingSongNumber].currentTime = 0;
			}
			else if(songAudiosDictionary[playingSongNumber] === undefined){
				songAudiosDictionary[playingSongNumber] = new Audio("/songs/128kbps/"+playingSongNumber.toString()+".mp3");
				setTimeout(() => { songAudiosDictionary[playingSongNumber].currentTime = 0; }, 1000);
			}
			else{}
		}
		else{}
	}
	// To play the previous song when the user isn't listening to the currently playing song which is playing from an album
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == false && isCurrentPlayingSongPlayingFromAnAlbum == true){
		if(playingAlbumQueue.indexOf(playingSongNumber) > 0){
			// To play the previous song
			if(isCurrentPlayingSongPlayingFromAnAlbum == true){
				if(playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))-1] != undefined){
					playingSongNumber = playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))-1];
				}
			}
			else if(isCurrentPlayingSongPlayingFromAnAlbum == false){
				playingSongNumber = Number(playingSongNumber) - 1;
			}
			else{}
			// To load the previous song if it is not loaded
			if(songAudiosDictionary[playingSongNumber] != undefined){
				playPreviousSong();
			}
			else if(songAudiosDictionary[playingSongNumber] === undefined){
				songAudiosDictionary[playingSongNumber] = new Audio("/songs/128kbps/"+playingSongNumber.toString()+".mp3");
				setTimeout(() => { playPreviousSong(); }, 1000);
			}
			else{}
			function playPreviousSong(){
				songAudiosDictionary[playingSongNumber].currentTime = 0;
				if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
					if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
					if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				if(playOrPauseCurrentSongButton.classList.contains("bi-play")){
					playOrPauseCurrentSongButton.classList.toggle("bi-play");
				}
				songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
				songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
				playOrPauseSong(playingSongNumber, 1);
				updateSongProgress(playingSongNumber, 1);
				isASongPlaying = true;
			}
		}
		// To restart the song when it is the first song available on the album
		else if(playingAlbumQueue.indexOf(playingSongNumber) == 0){
			// To load the first song if it is not loaded
			if(songAudiosDictionary[playingSongNumber] != undefined){
				songAudiosDictionary[playingSongNumber].currentTime = 0;
			}
			else if(songAudiosDictionary[playingSongNumber] === undefined){
				songAudiosDictionary[playingSongNumber] = new Audio("/songs/128kbps/"+playingSongNumber.toString()+".mp3");
				setTimeout(() => { songAudiosDictionary[playingSongNumber].currentTime = 0; }, 1000);
			}
			else{}
		}
		else{}
	}
	else{}
});


// Play or pause current song button function
playOrPauseCurrentSongButton.addEventListener("click", () => {
	// No song plays as the user has not selected a song
	if(songPlayerSongNameH5.innerText == ""){}
	// To pause the current playing song
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == true){
		if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
			if(!document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
				document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
			}
		}
		if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
			if(!document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
				document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
			}
		}
		if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
			if(!document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
				document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
			}
		}
		if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
			if(!document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
				document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
			}
		}
		if(!playOrPauseCurrentSongButton.classList.contains("bi-play")){
			playOrPauseCurrentSongButton.classList.toggle("bi-play");
		}
		playOrPauseSong(playingSongNumber, 0);
		updateSongProgress(playingSongNumber, 0);
		isASongPlaying = false;
	}
	// To play the current playing song
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == false){
		if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
			if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
				document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
			}
		}
		if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
			if(document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
				document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
			}
		}
		if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
			if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
				document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
			}
		}
		if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
			if(document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
				document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
			}
		}
		if(playOrPauseCurrentSongButton.classList.contains("bi-play")){
			playOrPauseCurrentSongButton.classList.toggle("bi-play");
		}
		playOrPauseSong(playingSongNumber, 1);
		updateSongProgress(playingSongNumber, 1);
		isASongPlaying = true;
	}
	else{}
});


// Go to the next song button function
goToNextSongButton.addEventListener("click", () => {
	// No song plays as the user has not selected a song
	if(songPlayerSongNameH5.innerText == ""){}
	// To play the next song when the user is listening to the currently playing song which isn't playing from an album
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == true && isCurrentPlayingSongPlayingFromAnAlbum == false){
		if(playingSongNumber < numberOfSongs){
			// To pause the current playing song
			if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
				if(!document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
				if(!document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			playOrPauseSong(playingSongNumber, 0);
			updateSongProgress(playingSongNumber, 0);
			isASongPlaying = false;
			// To play the next song
			if(isCurrentPlayingSongPlayingFromAnAlbum == true){
				if(playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))+1] != undefined){
					playingSongNumber = playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))+1];
				}
			}
			else if(isCurrentPlayingSongPlayingFromAnAlbum == false){
				playingSongNumber = Number(playingSongNumber) + 1;
			}
			else{}
			// To load the next song if it is not loaded
			if(songAudiosDictionary[playingSongNumber] != undefined){
				playNextSong();
			}
			else if(songAudiosDictionary[playingSongNumber] === undefined){
				songAudiosDictionary[playingSongNumber] = new Audio("/songs/128kbps/"+playingSongNumber.toString()+".mp3");
				setTimeout(() => { playNextSong(); }, 1000);
			}
			else{}
			function playNextSong(){
				songAudiosDictionary[playingSongNumber].currentTime = 0;
				if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
					if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
					if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
				songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
				playOrPauseSong(playingSongNumber, 1);
				updateSongProgress(playingSongNumber, 1);
				isASongPlaying = true;
			}
		}
		// To end songs playing when played the last song available on the songs list
		else if(playingSongNumber == numberOfSongs){
			songAudiosDictionary[playingSongNumber].currentTime = songAudiosDictionary[playingSongNumber].duration;
		}
		else{}
	}
	// To play the next song when the user is listening to the currently playing song which is playing from an album
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == true && isCurrentPlayingSongPlayingFromAnAlbum == true){
		if(playingAlbumQueue.indexOf(playingSongNumber) < playingAlbumQueue.indexOf(playingAlbumQueue[Number(playingAlbumQueue.length - 1)])){
			// To pause and end the current song progress update
			if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
				if(!document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
				if(!document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			playOrPauseSong(playingSongNumber, 0);
			updateSongProgress(playingSongNumber, 0);
			isASongPlaying = false;
			// To play the next song
			if(isCurrentPlayingSongPlayingFromAnAlbum == true){
				if(playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))+1] != undefined){
					playingSongNumber = playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))+1];
				}
			}
			else if(isCurrentPlayingSongPlayingFromAnAlbum == false){
				playingSongNumber = Number(playingSongNumber) + 1;
			}
			else{}
			// To load the next song if it is not loaded
			if(songAudiosDictionary[playingSongNumber] != undefined){
				playNextSong();
			}
			else if(songAudiosDictionary[playingSongNumber] === undefined){
				songAudiosDictionary[playingSongNumber] = new Audio("/songs/128kbps/"+playingSongNumber.toString()+".mp3");
				setTimeout(() => { playNextSong(); }, 1000);
			}
			else{}
			function playNextSong(){
				songAudiosDictionary[playingSongNumber].currentTime = 0;
				if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
					if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
					if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
				songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
				playOrPauseSong(playingSongNumber, 1);
				updateSongProgress(playingSongNumber, 1);
				isASongPlaying = true;
			}
		}
		// To end songs playing when played the last song available on the album
		else if(playingSongNumber == playingAlbumQueue[Number(playingAlbumQueue.length - 1)]){
			songAudiosDictionary[playingSongNumber].currentTime = songAudiosDictionary[playingSongNumber].duration;
		}
		else{}
	}
	// To play the next song when the user isn't listening to the currently playing song which isn't playing from an album
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == false && isCurrentPlayingSongPlayingFromAnAlbum == false){
		if(playingSongNumber < numberOfSongs){
			// To play the next song
			if(isCurrentPlayingSongPlayingFromAnAlbum == true){
				if(playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))+1] != undefined){
					playingSongNumber = playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))+1];
				}
			}
			else if(isCurrentPlayingSongPlayingFromAnAlbum == false){
				playingSongNumber = Number(playingSongNumber) + 1;
			}
			else{}
			// To load the next song if it is not loaded
			if(songAudiosDictionary[playingSongNumber] != undefined){
				playNextSong();
			}
			else if(songAudiosDictionary[playingSongNumber] === undefined){
				songAudiosDictionary[playingSongNumber] = new Audio("/songs/128kbps/"+playingSongNumber.toString()+".mp3");
				setTimeout(() => { playNextSong(); }, 1000);
			}
			else{}
			function playNextSong(){
				songAudiosDictionary[playingSongNumber].currentTime = 0;
				if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
					if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
					if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				if(playOrPauseCurrentSongButton.classList.contains("bi-play")){
					playOrPauseCurrentSongButton.classList.toggle("bi-play");
				}
				songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
				songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
				playOrPauseSong(playingSongNumber, 1);
				updateSongProgress(playingSongNumber, 1);
				isASongPlaying = true;
			}
		}
		// To end songs playing when played the last song available on the songs list
		else if(playingSongNumber == numberOfSongs){
			songAudiosDictionary[playingSongNumber].currentTime = songAudiosDictionary[playingSongNumber].duration;
		}
		else{}
	}
	// To play the next song when the user isn't listening to the currently playing song which is playing from an album
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == false && isCurrentPlayingSongPlayingFromAnAlbum == true){
		if(playingAlbumQueue.indexOf(playingSongNumber) < playingAlbumQueue.indexOf(playingAlbumQueue[Number(playingAlbumQueue.length - 1)])){
			// To play the next song
			if(isCurrentPlayingSongPlayingFromAnAlbum == true){
				if(playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))+1] != undefined){
					playingSongNumber = playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))+1];
				}
			}
			else if(isCurrentPlayingSongPlayingFromAnAlbum == false){
				playingSongNumber = Number(playingSongNumber) + 1;
			}
			else{}
			// To load the next song if it is not loaded
			if(songAudiosDictionary[playingSongNumber] != undefined){
				playNextSong();
			}
			else if(songAudiosDictionary[playingSongNumber] === undefined){
				songAudiosDictionary[playingSongNumber] = new Audio("/songs/128kbps/"+playingSongNumber.toString()+".mp3");
				setTimeout(() => { playNextSong(); }, 1000);
			}
			else{}
			function playNextSong(){
				songAudiosDictionary[playingSongNumber].currentTime = 0;
				if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
					if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
					if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				if(playOrPauseCurrentSongButton.classList.contains("bi-play")){
					playOrPauseCurrentSongButton.classList.toggle("bi-play");
				}
				songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
				songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
				playOrPauseSong(playingSongNumber, 1);
				updateSongProgress(playingSongNumber, 1);
				isASongPlaying = true;
			}
		}
		// To end songs playing when played the last song available on the album
		else if(playingSongNumber == playingAlbumQueue[Number(playingAlbumQueue.length - 1)]){
			songAudiosDictionary[playingSongNumber].currentTime = songAudiosDictionary[playingSongNumber].duration;
		}
		else{}
	}
	else{}
});


// Download current song button function
downloadCurrentSongButton.addEventListener("click", ()=>{
	let aElement = document.createElement("a");
	aElement.setAttribute("href", "/songs/128kbps/"+playingSongNumber+".mp3");
	aElement.download = (songPlayerSongNameH5.innerText+"-"+songPlayerArtistNameH6.innerText).replace(/\s/g, "-");
	aElement.click();
});


// Play or pause current song function
function playOrPauseSong(songNumber, playOrPauseSong) {
	let song = songAudiosDictionary[songNumber];

	// To pause a song
	if(playOrPauseSong == 0){
		song.pause();
	}
	// To play a song
	else if(playOrPauseSong == 1){
		song.play();
	}
	else{}
}


// Update song time progress function
function updateSongElapsedAndRemainingTime(currentSong){
	let songElapsedTimeInSeconds = Math.floor(currentSong.currentTime);
	let songElapsedTimeInMinutes = Math.floor(songElapsedTimeInSeconds/60);
	let songRemainingTimeInSeconds = (Math.floor(currentSong.duration))-songElapsedTimeInSeconds;
	let songRemainingTimeInMinutes = Math.floor(songRemainingTimeInSeconds/60);

	// Show Elapsed time
	// Show time when the elapsed time seconds is less than 10 seconds
	if(songElapsedTimeInSeconds-(songElapsedTimeInMinutes*60) > 0 && songElapsedTimeInSeconds-(songElapsedTimeInMinutes*60) < 10){
		songPlayerElapsedTimeSpan.innerText = songElapsedTimeInMinutes+":0"+(songElapsedTimeInSeconds-(songElapsedTimeInMinutes*60));
	}
	// Show time when elapsed time is at a new minute
	else if((songElapsedTimeInSeconds-(songElapsedTimeInMinutes*60)) == 0){
		songPlayerElapsedTimeSpan.innerText = songElapsedTimeInMinutes+":00";
	}
	// Show time when the elapsed time seconds is from 10 seconds to 59 seconds
	else if(songElapsedTimeInSeconds-(songElapsedTimeInMinutes*60) >= 10 && songElapsedTimeInSeconds-(songElapsedTimeInMinutes*60) < 60){
		songPlayerElapsedTimeSpan.innerText = songElapsedTimeInMinutes+":"+(songElapsedTimeInSeconds-(songElapsedTimeInMinutes*60));
	}
	else{}


	// Show Remaining time
	// Show time when the reamining time seconds is less than 10 seconds
	if(songRemainingTimeInSeconds-(songRemainingTimeInMinutes*60) > 0 && songRemainingTimeInSeconds-(songRemainingTimeInMinutes*60) < 10){
		songPlayerRemainingTimeSpan.innerText = songRemainingTimeInMinutes+":0"+(songRemainingTimeInSeconds-(songRemainingTimeInMinutes*60));
	}
	// Show time when reamining time is at a new minute
	else if((songRemainingTimeInSeconds-(songRemainingTimeInMinutes*60)) == 0){
		songPlayerRemainingTimeSpan.innerText = songRemainingTimeInMinutes+":00";
	}
	// Show time when the reamining time seconds is from 10 seconds to 59 seconds
	else if(songRemainingTimeInSeconds-(songRemainingTimeInMinutes*60) >= 10 && songRemainingTimeInSeconds-(songRemainingTimeInMinutes*60) < 60){
		songPlayerRemainingTimeSpan.innerText = songRemainingTimeInMinutes+":"+(songRemainingTimeInSeconds-(songRemainingTimeInMinutes*60));
	}
	else{}
}

// Update song slider position function
function updateSongProgressBar(currentSong){
	songPlayerProgressBar.value = ((currentSong.currentTime/currentSong.duration)*100);
}


// Play next song when current song ends
function playNextSongWhenCurrentSongEnds(currentSong){
	if(isCurrentPlayingSongPlayingFromAnAlbum == false){
		if((currentSong.duration-currentSong.currentTime) <= .5 && playingSongNumber < numberOfSongs){
			// To pause and end the current song progress update
			if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
				if(!document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
				if(!document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			playOrPauseSong(playingSongNumber, 0);
			updateSongProgress(playingSongNumber, 0);
			isASongPlaying = false;
			// To play the next song
			if(isCurrentPlayingSongPlayingFromAnAlbum == true){
				if(playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))+1] != undefined){
					playingSongNumber = playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))+1];
				}
			}
			else if(isCurrentPlayingSongPlayingFromAnAlbum == false){
				playingSongNumber = Number(playingSongNumber) + 1;
			}
			else{}
			// To load the next song if it is not loaded
			if(songAudiosDictionary[playingSongNumber] != undefined){
				playNextSong();
			}
			else if(songAudiosDictionary[playingSongNumber] === undefined){
				songAudiosDictionary[playingSongNumber] = new Audio("/songs/128kbps/"+playingSongNumber.toString()+".mp3");
				setTimeout(() => { playNextSong(); }, 1000);
			}
			else{}
			function playNextSong(){
				songAudiosDictionary[playingSongNumber].currentTime = 0;
				if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
					if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
					if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
				songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
				playOrPauseSong(playingSongNumber, 1);
				updateSongProgress(playingSongNumber, 1);
				isASongPlaying = true;
			}
		}
		// To end songs playing when played the last song available on the songs list
		else if((currentSong.duration-currentSong.currentTime) <= .5 && playingSongNumber == numberOfSongs){
			if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
				if(!document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
				if(!document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(!playOrPauseCurrentSongButton.classList.contains("bi-play")){
				playOrPauseCurrentSongButton.classList.toggle("bi-play");
			}
			playOrPauseSong(playingSongNumber, 0);
			updateSongProgress(playingSongNumber, 0);
			isASongPlaying = false;
		}
		else{}
	}
	else if(isCurrentPlayingSongPlayingFromAnAlbum == true){
		if((currentSong.duration-currentSong.currentTime) <= .5 && playingAlbumQueue.indexOf(playingSongNumber) < playingAlbumQueue.indexOf(playingAlbumQueue[Number(playingAlbumQueue.length - 1)])){
			// To pause and end the current song progress update
			if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
				if(!document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
				if(!document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			playOrPauseSong(playingSongNumber, 0);
			updateSongProgress(playingSongNumber, 0);
			isASongPlaying = false;
			// To play the next song
			// To load the next song if it is not loaded
			if(songAudiosDictionary[playingSongNumber] != undefined){
				playNextSong();
			}
			else if(songAudiosDictionary[playingSongNumber] === undefined){
				songAudiosDictionary[playingSongNumber] = new Audio("/songs/128kbps/"+playingSongNumber.toString()+".mp3");
				setTimeout(() => { playNextSong(); }, 1000);
			}
			else{}
			function playNextSong(){
				if(isCurrentPlayingSongPlayingFromAnAlbum == true){
					if(playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))+1] != undefined){
						playingSongNumber = playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))+1];
					}
				}
				else if(isCurrentPlayingSongPlayingFromAnAlbum == false){
					playingSongNumber = Number(playingSongNumber) + 1;
				}
				else{}
				songAudiosDictionary[playingSongNumber].currentTime = 0;
				if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
					if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
					if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
					if(document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
						document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
					}
				}
				songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
				songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
				playOrPauseSong(playingSongNumber, 1);
				updateSongProgress(playingSongNumber, 1);
				isASongPlaying = true;
			}
		}
		// To end songs playing when played the last song available on the album
		else if((currentSong.duration-currentSong.currentTime) <= .5 && playingSongNumber == playingAlbumQueue[Number(playingAlbumQueue.length - 1)]){
			if(document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill")){
				if(!document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-preview-li .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-list-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-list-li .song-list-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill");
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list")){
				if(!document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-in-specific-album-song-li-from-songs-list .specific-album-songs-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(document.querySelector(".song-"+playingSongNumber+"-song-result-li")){
				if(!document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.contains("bi-play-fill")){
					document.querySelector(".song-"+playingSongNumber+"-song-result-li .song-result-song-li-button-container .bi-pause-fill").classList.toggle("bi-play-fill")
				}
			}
			if(!playOrPauseCurrentSongButton.classList.contains("bi-play")){
				playOrPauseCurrentSongButton.classList.toggle("bi-play");
			}
			playOrPauseSong(playingSongNumber, 0);
			updateSongProgress(playingSongNumber, 0);
			isASongPlaying = false;
		}
		else{}
	}
	else{}
}