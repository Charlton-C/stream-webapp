var songsPreviewsDivUl = document.querySelector(".songs-previews-ul");
var songsListDivUl = document.querySelector(".songs-list-div-ul");
var songPlayerSongNameH5 = document.querySelector(".song-player-song-name");
var songPlayerArtistNameH6 = document.querySelector(".song-player-artist-name");


// To ensure fetch loads the audio information before it is required by the page
setTimeout(() =>{
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
			liElement.addEventListener("click", () => {
				songPlayerSongNameH5.innerText = songsInfo[songNumber.toString()][0];
				songPlayerArtistNameH6.innerText = songsInfo[songNumber.toString()][1];

				// Change image play or pause button to show whether a song is playing
				// To play the first song or to play a different song while the previous one is paused
				if(isASongPlaying == false && playingSongNumber != songNumber){
					liElementDiv3Button.classList.toggle("bi-play-fill");
					playOrPauseCurrentSongButton.classList.toggle("bi-play");
					playOrPauseSong(playingSongNumber, songNumber);
					updateSongProgress(songNumber, 1);
					isASongPlaying = true;
				}
				// To continue to play the same song
				else if(isASongPlaying == false && playingSongNumber == songNumber){
					liElementDiv3Button.classList.toggle("bi-play-fill");
					playOrPauseCurrentSongButton.classList.toggle("bi-play");
					playOrPauseSong(playingSongNumber, songNumber);
					updateSongProgress(songNumber, 1);
					isASongPlaying = true;
				}
				// To play a different song while another one is still playing (pause the other one)
				else if(isASongPlaying == true && playingSongNumber != songNumber){
					document.querySelector("[class='song-"+playingSongNumber+"-song-list-li'] .bi-pause-fill").classList.toggle("bi-play-fill");
					liElementDiv3Button.classList.toggle("bi-play-fill");
					updateSongProgress(playingSongNumber, 0);
					playOrPauseSong(playingSongNumber, songNumber);
					updateSongProgress(songNumber, 1);
				}
				// To pause a song
				else if(isASongPlaying == true && playingSongNumber == songNumber){
					liElementDiv3Button.classList.toggle("bi-play-fill");
					playOrPauseCurrentSongButton.classList.toggle("bi-play");
					playOrPauseSong(playingSongNumber, songNumber);
					updateSongProgress(playingSongNumber, 0);
					isASongPlaying = false;
				}
				else{}


				playingSongNumber = songNumber;
				isCurrentPlayingSongPlayingFromAnAlbum = false;
				playingAlbumQueue = [];
			});


			songsListDivUl.appendChild(liElement);
		}
	}
	createSongsLiInSongsListPage();
}, 100);