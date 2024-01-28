var songsInfo = JSON.parse(JSON.stringify({newVar: "newVar"}));
var albumsInfo = JSON.parse(JSON.stringify({newVar: "newVar"}));
var artistsInfo = JSON.parse(JSON.stringify({newVar: "newVar"}));
fetch("/resources/songAudioInfo/json/songsInfo.json")
	.then(response => response.json())
	.then(json => songsInfo = json);

fetch("/resources/songAudioInfo/json/albumsInfo.json")
	.then(response => response.json())
	.then(json => albumsInfo = json);

fetch("/resources/songAudioInfo/json/artistsInfo.json")
	.then(response => response.json())
	.then(json => artistsInfo = json);


var songPlayerSongNameH5 = document.querySelector(".song-player-song-name");
var songPlayerArtistNameH6 = document.querySelector(".song-player-artist-name");
var songPlayerElapsedTimeSpan = document.querySelector(".song-player-elapsed-time-span");
var songPlayerProgressBar = document.querySelector(".song-player-progress-bar");
var songPlayerRemainingTimeSpan = document.querySelector(".song-player-remaining-time-span");
var downloadCurrentSongButton = document.querySelector(".download-current-song-button");
var goToPreviousSongButton = document.querySelector(".go-to-previous-song-button");
var playOrPauseCurrentSongButton = document.querySelector(".play-or-pause-current-song-button");
var goToNextSongButton = document.querySelector(".go-to-next-song-button");
var songsArray = [];
var albumsArray = [];
var playingAlbumQueue = [];
var isASongPlaying = false;
var isCurrentPlayingSongPlayingFromAnAlbum;
var updateSongProgressInterval = null;
var playingSongNumber = 1;
var numberOfSongs = 10;
var numberOfAlbums;


// To ensure fetch has loaded the audio information before it is required
setTimeout(() =>{
	// Get the number of albums after fetch completes
	numberOfAlbums = Object.keys(albumsInfo).length;

	// Add album names and album index to the albumsArray after fetch completes
	for(let key in albumsInfo){
		albumsArray.push([key, albumsInfo[key]]);
	}
}, 100);


// Set songs in the songs array
for(let i = 1; i <= numberOfSongs; i++){
	songsArray[i] = new Audio("/songs/"+i+".mp3");
}


// Change current song position when the user slides the current playing song slider
songPlayerProgressBar.addEventListener("change", ()=>{
	// To pause the song
	playOrPauseSong(playingSongNumber, playingSongNumber);
	updateSongProgress(playingSongNumber, 0);
	isASongPlaying = false;
	// To change the time of the song to the time the user has slide the slider to
	songsArray[playingSongNumber].currentTime = Math.floor((songPlayerProgressBar.value/100)*songsArray[playingSongNumber].duration);
	// To continue to play the song from the new position
	playOrPauseSong(playingSongNumber, playingSongNumber);
	updateSongProgress(playingSongNumber, 1);
	isASongPlaying = true;
});

// Function to change the current song progress info every second
function updateSongProgress(playingSongNumber, turnOnOrOff){
	let currentSong = songsArray[playingSongNumber];
	if(turnOnOrOff == 1){
		updateSongProgressInterval = setInterval(()=>{
			updateSongProgressBar(currentSong);
			updateSongElapsedAndRemainingTime(currentSong);
			playNextSongWhenCurrentSongEnds(currentSong);
		}, 1000);
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
	// To play the previous song when the user is currently listening to another song
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber > 1 && isASongPlaying == true){
		// To pause the current playing song
		if(document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill")){
			document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
		}
		if(document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill")){
			document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
		}
		if(document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
			document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
		}
		playOrPauseCurrentSongButton.classList.toggle("bi-play-fill");
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 0);
		isASongPlaying = false;
		if(isCurrentPlayingSongPlayingFromAnAlbum == true){
			if(playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))-1] != undefined){
				playingSongNumber = playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))-1];
			}
		}
		else if(isCurrentPlayingSongPlayingFromAnAlbum == false){
			playingSongNumber = Number(playingSongNumber) - 1;
		}
		else{}
		songsArray[playingSongNumber].currentTime = 0;
		// To play the previous song
		if(document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill")){
			document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
		}
		if(document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill")){
			document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
		}
		if(document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
			document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
		}
		playOrPauseCurrentSongButton.classList.toggle("bi-play-fill");
		songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
		songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 1);
		isASongPlaying = true;
	}
	// To play the previous song when the user has paused the currently listening to song
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber > 1 && isASongPlaying == false){
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
		songsArray[playingSongNumber].currentTime = 0;
		if(document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill")){
			document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
		}
		if(document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill")){
			document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
		}
		if(document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
			document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
		}
		playOrPauseCurrentSongButton.classList.toggle("bi-play-fill");
		songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
		songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 1);
		isASongPlaying = true;
	}
	else{}
});


// Play or pause current song button function
playOrPauseCurrentSongButton.addEventListener("click", () => {
	// No song plays as the user has not selected a song
	if(songPlayerSongNameH5.innerText == ""){}
	// To pause the current playing song
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == true){
		document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
		document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
		if(document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
			document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
		}
		playOrPauseCurrentSongButton.classList.toggle("bi-play-fill");
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 0);
		isASongPlaying = false;
	}
	// To play the current playing song
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == false){
		document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
		document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
		if(document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
			document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
		}
		playOrPauseCurrentSongButton.classList.toggle("bi-play-fill");
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 1);
		isASongPlaying = true;
	}
	else{}
});


// Go to the next song button function
goToNextSongButton.addEventListener("click", () => {
	// No song plays as the user has not selected a song
	if(songPlayerSongNameH5.innerText == ""){}
	// To play the next song when the user is listening to the currently playing song
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == true && playingSongNumber < numberOfSongs){
		// To pause the current playing song
		document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
		document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
		if(document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
			document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
		}
		playOrPauseCurrentSongButton.classList.toggle("bi-play-fill");
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 0);
		isASongPlaying = false;
		if(isCurrentPlayingSongPlayingFromAnAlbum == true){
			if(playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))+1] != undefined){
				playingSongNumber = playingAlbumQueue[Number(playingAlbumQueue.indexOf(playingSongNumber))+1];
			}
		}
		else if(isCurrentPlayingSongPlayingFromAnAlbum == false){
			playingSongNumber = Number(playingSongNumber) + 1;
		}
		else{}
		songsArray[playingSongNumber].currentTime = 0;
		// To play the next song
		document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
		document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
		if(document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
			document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
		}
		playOrPauseCurrentSongButton.classList.toggle("bi-play-fill");
		songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
		songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 1);
		isASongPlaying = true;
	}
	// To play the next song when the user has paused the currently playing song
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == false && playingSongNumber < numberOfSongs){
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
		songsArray[playingSongNumber].currentTime = 0;
		document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
		document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
		if(document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
			document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
		}
		playOrPauseCurrentSongButton.classList.toggle("bi-play-fill");
		songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
		songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 1);
		isASongPlaying = true;
	}
	// To restart the current song when their is no next song to play and their is a song playing
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == true && playingSongNumber == numberOfSongs){
		// To restart the current song
		songsArray[playingSongNumber].currentTime = 0;
	}
	// To restart the current song when their is no next song to play and their isn't a song playing
	else if(songPlayerSongNameH5.innerText != "" && playingSongNumber != 0 && isASongPlaying == false && playingSongNumber == numberOfSongs){
		// To restart the current song
		songsArray[playingSongNumber].currentTime = 0;
		document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
		document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
		if(document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
			document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
		}
		playOrPauseCurrentSongButton.classList.toggle("bi-play-fill");
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 1);
		isASongPlaying = true;
	}
	else{}
});


// Download current song button function
downloadCurrentSongButton.addEventListener("click", ()=>{
	let aElement = document.createElement("a");
	aElement.setAttribute("href", "/songs/"+playingSongNumber+".mp3");
	aElement.download = (songPlayerSongNameH5.innerText+"-"+songPlayerArtistNameH6.innerText).replace(/\s/g, "-");
	aElement.click();
});


// Play or pause current song function
function playOrPauseSong(playingSongNumber, songNumber){
	let previousSong = songsArray[playingSongNumber];
	let currentSong = songsArray[songNumber];

	// To play the first song or to play a different song while the previous one is paused
	if(isASongPlaying == false && playingSongNumber != songNumber){
		currentSong.currentTime = 0;
		currentSong.play();
	}
	// To continue to play the same song
	else if(isASongPlaying == false && playingSongNumber == songNumber){
		currentSong.play();
	}
	// To play a different song while another one is still playing(pause this other one)
	else if(isASongPlaying == true && playingSongNumber != songNumber){
		previousSong.pause();
		currentSong.currentTime = 0;
		currentSong.play();
	}
	// To pause a song
	else if(isASongPlaying == true && playingSongNumber == songNumber){
		currentSong.pause();
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
		if(currentSong.currentTime == currentSong.duration && playingSongNumber < numberOfSongs){
			// To pause and end the current song progress update
			document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
			if(document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
				document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
			}
			playOrPauseSong(playingSongNumber, playingSongNumber);
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
			songsArray[playingSongNumber].currentTime = 0;
			document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
			if(document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
				document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
			}
			songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
			songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 1);
			isASongPlaying = true;
		}
		// To end songs playing when played the last song available either on songs list or album
		else if(currentSong.currentTime == currentSong.duration && playingSongNumber == numberOfSongs){
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 0);
			document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
			if(document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
				document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
			}
			playNextSongWhenCurrentSongEnds.classList.toggle("bi-play-fill");
			isASongPlaying = false;
		}
		else{}
	}
	else if(isCurrentPlayingSongPlayingFromAnAlbum == true){
		if(currentSong.currentTime == currentSong.duration && playingAlbumQueue.indexOf(playingSongNumber) < playingAlbumQueue.indexOf(playingAlbumQueue[Number(playingAlbumQueue.length - 1)])){
			// To pause and end the current song progress update
			document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
			if(document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
				document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
			}
			playOrPauseSong(playingSongNumber, playingSongNumber);
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
			songsArray[playingSongNumber].currentTime = 0;
			document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
			if(document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
				document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
			}
			songPlayerSongNameH5.innerText = songsInfo[playingSongNumber][0];
			songPlayerArtistNameH6.innerText = songsInfo[playingSongNumber][1];
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 1);
			isASongPlaying = true;
		}
		// To end songs playing when played the last song available either on songs list or album
		else if(currentSong.currentTime == currentSong.duration && playingSongNumber == playingAlbumQueue[Number(playingAlbumQueue.length - 1)]){
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 0);
			document.querySelector("[class='song-"+playingSongNumber+"-preview-li'] .image-and-image_play-container .bi-pause-fill").classList.toggle("bi-play-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
			if(document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
				document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
			}
			playNextSongWhenCurrentSongEnds.classList.toggle("bi-play-fill");
			isASongPlaying = false;
		}
		else{}
	}
	else{}
}