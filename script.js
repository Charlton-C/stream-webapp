var expandLibraryButton = document.querySelector("#music_side-library");
var expandSongsButton = document.querySelector(".expand-songs-div");
var previewSongsDivUl = document.querySelector(".songs-ul");
var songsListDivUl = document.querySelector(".songs_list_div-ul");
var playingSongImage = document.querySelector(".playing-song-image");
var playingSongElapsedTimeSpan = document.querySelector(".playing-song-elapsed-time-span");
var playingSongProgressBar = document.querySelector(".playing-song-progress-bar");
var playingSongRemainingTimeSpan = document.querySelector(".playing-song-remaining-time-span");
var playingSongNameSpan = document.querySelector(".playing-song-name-span");
var playingSongArtistSpan = document.querySelector(".playing-song-artist-span");
var previousSongButton = document.querySelector(".previous-song-button");
var playOrPauseSongButton = document.querySelector(".play-or-pause-song-button");
var nextSongButton = document.querySelector(".next-song-button");
var downloadSongButton = document.querySelector(".download-song-button");
var volumeButton = document.querySelector(".volume-button");
var volumeBar = document.querySelector(".volume-bar");
var songsArray = [];
var isASongPlaying = false;
var updateSongProgressInterval = null;
var playingSongNumber = 0;
var numberOfSongs = 10;


// Set songs in the songs array
for(var i = 1; i <= numberOfSongs; i++){
	songsArray[i] = new Audio("/songs/"+i+".mp3");
}


expandLibraryButton.addEventListener("click", () => {
	document.querySelector(".songs_list_div").style.display = "none";
	document.querySelector(".music_div").style.display = "block";
	expandLibraryButton.style.color = "rgb(42, 231, 241)";
	expandLibraryButton.style.textDecoration = "underline";
});


expandSongsButton.addEventListener("click", () => {
	document.querySelector(".music_div").style.display = "none";
	document.querySelector(".songs_list_div").style.display = "block";
	expandLibraryButton.style.color = "rgb(106, 107, 111)";
	expandLibraryButton.style.textDecoration = "none";
	createSongItemsInSongsListPage();
});


playingSongProgressBar.addEventListener("change", ()=>{
	// To pause the song
	playOrPauseSong(playingSongNumber, playingSongNumber);
	updateSongProgress(playingSongNumber, 0);
	isASongPlaying = false;
	// To change the time of the song to the time the user has slide the slider to
	songsArray[playingSongNumber].currentTime = Math.floor((playingSongProgressBar.value/100)*songsArray[playingSongNumber].duration);
	// To continue to play the song from the new position
	playOrPauseSong(playingSongNumber, playingSongNumber);
	updateSongProgress(playingSongNumber, 1);
	isASongPlaying = true;
});


// Function to change the song progress info every second
function updateSongProgress(playingSongNumber, turnOnOrOff){
	var currentSong = songsArray[playingSongNumber];
	if(turnOnOrOff == 1){
		updateSongProgressInterval = setInterval(()=>{
			updateSongProgressBar(currentSong);
			updateSongElapsedAndRemainingTime(currentSong);
		}, 1000);
	}
	else if(turnOnOrOff == 0){
		clearInterval(updateSongProgressInterval);
	}
	else{}
};


previousSongButton.addEventListener("click", () => {
	// No song plays as the user has not selected a song
	if(playingSongNameSpan.innerText == ""){}
	// To play the previous song when the user is currently listening to another song
	else if(playingSongNameSpan.innerText != "" && playingSongNumber > 1 && isASongPlaying == true){
		// To pause the current playing song
		document.querySelector("[class='"+playingSongNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
		playOrPauseSongButton.classList.toggle("bi-play-fill");
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 0);
		isASongPlaying = false;
		playingSongNumber = Number(playingSongNumber) - 1;
		songsArray[playingSongNumber].currentTime = 0;
		// To play the next song
		document.querySelector("[class='"+playingSongNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
		playOrPauseSongButton.classList.toggle("bi-play-fill");
		ID3.loadTags("/songs/"+playingSongNumber+".mp3", () => {
			var tags = ID3.getAllTags("/songs/"+playingSongNumber+".mp3");
			// Get image from next song metadata and change the playing song image
			var image = tags.picture;
			if(image){
				var base64String = "";
				for (var i = 0; i < image.data.length; i++){
					base64String += String.fromCharCode(image.data[i]);
				}
				var base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
				playingSongImage.setAttribute("src", base64);
			} else if(!image){
				playingSongImage.setAttribute("src", "/resources/no-image.png");
			}
			else {}
			playingSongNameSpan.innerText = tags.title;
			playingSongArtistSpan.innerText = tags.artist;
		});
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 1);
		isASongPlaying = true;
	}
	// To play the previous song when the user has paused the currently listening to song
	else if(playingSongNameSpan.innerText != "" && playingSongNumber > 1 && isASongPlaying == false){
		// To play the next song
		playingSongNumber = Number(playingSongNumber) - 1;
		songsArray[playingSongNumber].currentTime = 0;
		document.querySelector("[class='"+playingSongNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
		playOrPauseSongButton.classList.toggle("bi-play-fill");
		ID3.loadTags("/songs/"+playingSongNumber+".mp3", () => {
			var tags = ID3.getAllTags("/songs/"+playingSongNumber+".mp3");
			// Get image from next song metadata and change the playing song image
			var image = tags.picture;
			if(image){
				var base64String = "";
				for (var i = 0; i < image.data.length; i++){
					base64String += String.fromCharCode(image.data[i]);
				}
				var base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
				playingSongImage.setAttribute("src", base64);
			} else if(!image){
				playingSongImage.setAttribute("src", "/resources/no-image.png");
			}
			else {}
			playingSongNameSpan.innerText = tags.title;
			playingSongArtistSpan.innerText = tags.artist;
		});
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 1);
		isASongPlaying = true;
	}
	else{}
});


playOrPauseSongButton.addEventListener("click", () => {
	// No song plays as the user has not selected a song
	if(playingSongNameSpan.innerText == ""){}
	// To pause the current playing song
	else if(playingSongNameSpan.innerText != "" && playingSongNumber != 0 && isASongPlaying == true){
		document.querySelector("[class='"+playingSongNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
		playOrPauseSongButton.classList.toggle("bi-play-fill");
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 0);
		isASongPlaying = false;
	}
	// To play the current playing song
	else if(playingSongNameSpan.innerText != "" && playingSongNumber != 0 && isASongPlaying == false){
		document.querySelector("[class='"+playingSongNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
		playOrPauseSongButton.classList.toggle("bi-play-fill");
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 1);
		isASongPlaying = true;
	}
	else{}
});


nextSongButton.addEventListener("click", () => {
	// No song plays as the user has not selected a song
	if(playingSongNameSpan.innerText == ""){}
	// To play the next song when the user is listening to the currently playing song
	else if(playingSongNameSpan.innerText != "" && playingSongNumber != 0 && isASongPlaying == true && playingSongNumber < numberOfSongs){
		// To pause the current playing song
		document.querySelector("[class='"+playingSongNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
		playOrPauseSongButton.classList.toggle("bi-play-fill");
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 0);
		isASongPlaying = false;
		playingSongNumber = Number(playingSongNumber) + 1;
		songsArray[playingSongNumber].currentTime = 0;
		// To play the next song
		document.querySelector("[class='"+playingSongNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
		playOrPauseSongButton.classList.toggle("bi-play-fill");
		ID3.loadTags("/songs/"+playingSongNumber+".mp3", () => {
			var tags = ID3.getAllTags("/songs/"+playingSongNumber+".mp3");
			// Get image from next song metadata and change the playing song image
			var image = tags.picture;
			if(image){
				var base64String = "";
				for (var i = 0; i < image.data.length; i++){
					base64String += String.fromCharCode(image.data[i]);
				}
				var base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
				playingSongImage.setAttribute("src", base64);
			} else if(!image){
				playingSongImage.setAttribute("src", "/resources/no-image.png");
			}
			else {}
			playingSongNameSpan.innerText = tags.title;
			playingSongArtistSpan.innerText = tags.artist;
		});
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 1);
		isASongPlaying = true;
	}
	// To play the next song when the user has paused the currently playing song
	else if(playingSongNameSpan.innerText != "" && playingSongNumber != 0 && isASongPlaying == false && playingSongNumber < numberOfSongs){
		// To play the next song
		playingSongNumber = Number(playingSongNumber) + 1;
		songsArray[playingSongNumber].currentTime = 0;
		document.querySelector("[class='"+playingSongNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
		playOrPauseSongButton.classList.toggle("bi-play-fill");
		ID3.loadTags("/songs/"+playingSongNumber+".mp3", () => {
			var tags = ID3.getAllTags("/songs/"+playingSongNumber+".mp3");
			// Get image from next song metadata and change the playing song image
			var image = tags.picture;
			if(image){
				var base64String = "";
				for (var i = 0; i < image.data.length; i++){
					base64String += String.fromCharCode(image.data[i]);
				}
				var base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
				playingSongImage.setAttribute("src", base64);
			} else if(!image){
				playingSongImage.setAttribute("src", "/resources/no-image.png");
			}
			else {}
			playingSongNameSpan.innerText = tags.title;
			playingSongArtistSpan.innerText = tags.artist;
		});
		playOrPauseSong(playingSongNumber, playingSongNumber);
		updateSongProgress(playingSongNumber, 1);
		isASongPlaying = true;
	}
	else{}
});


function createSongsPreviews(){
	var loopCount = 1;
	var intervalVariable = setInterval(()=>{
		var songNumber = loopCount.toString();
		ID3.loadTags("/songs/"+songNumber+".mp3", () => {
			var tags = ID3.getAllTags("/songs/"+songNumber+".mp3");
			var liElement = document.createElement("li");
			liElement.setAttribute("class", songNumber);
			var liElementDiv = document.createElement("div");
			liElementDiv.setAttribute("class", "img_play");
			var liElementDivImg = document.createElement("img");
			// Get image from metadata and add it to the img tag
			var image = tags.picture;
			if(image){
				var base64String = "";
				for (var i = 0; i < image.data.length; i++){
					base64String += String.fromCharCode(image.data[i]);
				}
				var base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
				liElementDivImg.setAttribute("src", base64);
			} else if(!image){
				liElementDivImg.setAttribute("src", "/resources/no-image.png");
			}
			else {}
			var liElementDivI = document.createElement("i");
			liElementDivI.setAttribute("class", "bi bi-play-circle-fill bi-pause-circle-fill");
			liElementDivI.setAttribute("id", "2");
			liElementDiv.appendChild(liElementDivImg);
			liElementDiv.appendChild(liElementDivI);
			var liElementH5 = document.createElement("h5");
			liElementH5.setAttribute("class", "song-"+songNumber+"-song-name");
			liElementH5.innerText = tags.title;
			var br = document.createElement("br");
			var liElementH5Div = document.createElement("div");
			liElementH5Div.setAttribute("class", "subtitle song-"+songNumber+"-artist-name");
			liElementH5Div.innerText = tags.artist;
			liElementH5.appendChild(br);
			liElementH5.appendChild(liElementH5Div);
			liElement.appendChild(liElementDiv);
			liElement.appendChild(liElementH5);
			liElement.addEventListener("click", () => {
				playingSongImage.setAttribute("src", liElementDivImg.src);
				playingSongNameSpan.innerText = tags.title;
				playingSongArtistSpan.innerText = tags.artist;
			
				// Change image play or pause button to show whether a song is playing
				// To play the first song or to play a different song while the previous one is paused
				if(isASongPlaying == false && playingSongNumber != songNumber){
					document.querySelector("[class='"+songNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
					playOrPauseSongButton.classList.toggle("bi-play-fill");
					playOrPauseSong(playingSongNumber, songNumber);
					updateSongProgress(songNumber, 1);
					isASongPlaying = true;
				}
				// To continue to play the same song
				else if(isASongPlaying == false && playingSongNumber == songNumber){
					document.querySelector("[class='"+songNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
					playOrPauseSongButton.classList.toggle("bi-play-fill");
					playOrPauseSong(playingSongNumber, songNumber);
					updateSongProgress(songNumber, 1);
					isASongPlaying = true;
				}
				// To play a different song while another one is still playing(pause this other one)
				else if(isASongPlaying == true && playingSongNumber != songNumber){
					document.querySelector("[class='"+playingSongNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
					document.querySelector("[class='"+songNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
					updateSongProgress(playingSongNumber, 0);
					playOrPauseSong(playingSongNumber, songNumber);
					updateSongProgress(songNumber, 1);
				}
				// To pause a song
				else if(isASongPlaying == true && playingSongNumber == songNumber){
					document.querySelector("[class='"+songNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
					playOrPauseSongButton.classList.toggle("bi-play-fill");
					playOrPauseSong(playingSongNumber, songNumber);
					updateSongProgress(playingSongNumber, 0);
					isASongPlaying = false;
				}
				else{}
				playingSongNumber = songNumber;
			});


			previewSongsDivUl.appendChild(liElement);
		}, {
			tags: ["picture", "title", "artist"]
		});


		loopCount++
		if(loopCount > numberOfSongs){
			clearInterval(intervalVariable);
		}
	}, 80);
}
createSongsPreviews();


function createSongItemsInSongsListPage(){
	songsListDivUl.innerHTML = "";
	var loopCount = 1;
	var intervalVariable = setInterval(()=>{
		var songNumber = loopCount.toString();
		ID3.loadTags("/songs/"+songNumber+".mp3", () => {
			var tags = ID3.getAllTags("/songs/"+songNumber+".mp3");
			var liElement = document.createElement("li");
			var liElementImg = document.createElement("img");
			// Get image from metadata and add it to the img tag
			var image = tags.picture;
			if(image){
				var base64String = "";
				for (var i = 0; i < image.data.length; i++){
					base64String += String.fromCharCode(image.data[i]);
				}
				var base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
				liElementImg.setAttribute("src", base64);
			} else if(!image){
				liElementImg.setAttribute("src", "/resources/no-image.png");
			}
			else {}
			var liElementH5 = document.createElement("h5");
			liElementH5.setAttribute("class", "song-"+songNumber+"-song-name");
			liElementH5.innerText = tags.title;
			var br = document.createElement("br");
			liElementH5.appendChild(br);
			var liElementH5Div = document.createElement("div");
			liElementH5Div.setAttribute("class", "subtitle song-"+songNumber+"-artist-name");
			liElementH5Div.innerText = tags.artist;
			liElementH5.appendChild(liElementH5Div);
			var liElementI = document.createElement("i");
			liElementI.setAttribute("class", "bi bi-play-circle-fill bi-pause-circle-fill");
			liElementI.setAttribute("id", "2");
			liElement.appendChild(liElementImg);
			liElement.appendChild(liElementH5);
			liElement.appendChild(liElementI);
			songsListDivUl.appendChild(liElement);
		}, {
			tags: ["picture", "title", "artist"]
		});

		loopCount++
		if(loopCount > numberOfSongs){
			clearInterval(intervalVariable);
		}
	}, 25);
}


function playOrPauseSong(playingSongNumber, songNumber){
	var previousSong = songsArray[playingSongNumber];
	var currentSong = songsArray[songNumber];

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


function updateSongElapsedAndRemainingTime(currentSong){
	var songElapsedTimeInSeconds = Math.floor(currentSong.currentTime);
	var songElapsedTimeInMinutes = Math.floor(songElapsedTimeInSeconds/60);
	var songRemainingTimeInSeconds = (Math.floor(currentSong.duration))-songElapsedTimeInSeconds;
	var songRemainingTimeInMinutes = Math.floor(songRemainingTimeInSeconds/60);


	// Show Elapsed time
	// Show time when the elapsed time seconds is less than 10 seconds
	if(songElapsedTimeInSeconds-(songElapsedTimeInMinutes*60) > 0 && songElapsedTimeInSeconds-(songElapsedTimeInMinutes*60) < 10){
		playingSongElapsedTimeSpan.innerText = songElapsedTimeInMinutes+":0"+(songElapsedTimeInSeconds-(songElapsedTimeInMinutes*60));
	}
	// Show time when elapsed time is at a new minute
	else if((songElapsedTimeInSeconds-(songElapsedTimeInMinutes*60)) == 0){
		playingSongElapsedTimeSpan.innerText = songElapsedTimeInMinutes+":00";
	}
	// Show time when the elapsed time seconds is from 10 seconds to 59 seconds
	else if(songElapsedTimeInSeconds-(songElapsedTimeInMinutes*60) >= 10 && songElapsedTimeInSeconds-(songElapsedTimeInMinutes*60) < 60){
		playingSongElapsedTimeSpan.innerText = songElapsedTimeInMinutes+":"+(songElapsedTimeInSeconds-(songElapsedTimeInMinutes*60));
	}
	else{}


	// Show Remaining time
	// Show time when the reamining time seconds is less than 10 seconds
	if(songRemainingTimeInSeconds-(songRemainingTimeInMinutes*60) > 0 && songRemainingTimeInSeconds-(songRemainingTimeInMinutes*60) < 10){
		playingSongRemainingTimeSpan.innerText = songRemainingTimeInMinutes+":0"+(songRemainingTimeInSeconds-(songRemainingTimeInMinutes*60));
	}
	// Show time when reamining time is at a new minute
	else if((songRemainingTimeInSeconds-(songRemainingTimeInMinutes*60)) == 0){
		playingSongRemainingTimeSpan.innerText = songRemainingTimeInMinutes+":00";
	}
	// Show time when the reamining time seconds is from 10 seconds to 59 seconds
	else if(songRemainingTimeInSeconds-(songRemainingTimeInMinutes*60) >= 10 && songRemainingTimeInSeconds-(songRemainingTimeInMinutes*60) < 60){
		playingSongRemainingTimeSpan.innerText = songRemainingTimeInMinutes+":"+(songRemainingTimeInSeconds-(songRemainingTimeInMinutes*60));
	}
	else{}
}


function updateSongProgressBar(currentSong){
    playingSongProgressBar.value = ((currentSong.currentTime/currentSong.duration)*100);
}