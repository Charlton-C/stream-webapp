var albumsPreviewsDivUl = document.querySelector(".albums-previews-div");
var albumsListDivUl = document.querySelector(".albums-list-div-ul");
var specificAlbumSongsListDivOl = document.querySelector(".specific-album-songs-list-div-ol");


// To ensure fetch loads the audio information before it is required by the page
setTimeout(() =>{
	// Function to create the albums previews when the website loads
	function createAlbumsListPreviews(){
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
				specificAlbumSongsListDivOl.innerHTML = "";
				document.querySelector("#albums_list_page").style.display = "none";
				document.querySelector("#specific_album_songs_list_page").style.display = "block";
				document.querySelector(".specific-album-image").src = liElementImg.src;
				document.querySelector(".specific-album-name").innerText = albumsArray[albumNumber-1][0];
				document.querySelector(".specific-album-artist-name").innerText = albumsArray[albumNumber-1][1][0];

				// Load the songs on the album page
				for(let songNumberInAlbum = 0; songNumberInAlbum < (albumsArray[albumNumber-1][1][1]).length; songNumberInAlbum++){
					let songNumber = albumsArray[albumNumber-1][1][1][songNumberInAlbum];
					let liElement = document.createElement("li");
					liElement.setAttribute("class", "song-"+songNumber+"-song-list-li song-"+(songNumberInAlbum+1)+"-specific-album-songs-list-li");
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
					liElementDiv2H5.setAttribute("class", "song-"+songNumber+"-song-name song-"+(songNumberInAlbum+1)+"-specific-album-songs-name");
					liElementDiv2H5.innerText = songsInfo[songNumber.toString()][0];
					let liElementDiv2H6 = document.createElement("h6");
					liElementDiv2H6.setAttribute("class", "song-"+songNumber+"-artist-name song-"+(songNumberInAlbum+1)+"-specific-album-songs-artist-name");
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
					liElement.addEventListener("click", () => {
						songPlayerSongNameH5.innerText = songsInfo[songNumber][0];
						songPlayerArtistNameH6.innerText = songsInfo[songNumber][1];

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
							if(document.querySelector(".song-"+playingSongNumber+"-song-list-li .bi-pause-fill")){
								document.querySelector(".song-"+playingSongNumber+"-song-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
							}
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
						isCurrentPlayingSongPlayingFromAnAlbum = true;
						for(let numberOfSongsToAddToPlayingAlbumQueue = 0; numberOfSongsToAddToPlayingAlbumQueue < (albumsArray[albumNumber-1][1]).length; numberOfSongsToAddToPlayingAlbumQueue++){
							playingAlbumQueue = albumsArray[albumNumber-1][1][numberOfSongsToAddToPlayingAlbumQueue];
						}
					});


					specificAlbumSongsListDivOl.appendChild(liElement);
				}


				// To change the play, pause status of a song in the album if the song is playing
				for(let i = 0; i < (albumsArray[albumNumber-1][1][1]).length; i++){
					if(isASongPlaying == true && document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill")){
						document.querySelector(".song-"+playingSongNumber+"-specific-album-songs-list-li .bi-pause-fill").classList.toggle("bi-play-fill");
					}
				}
			});


			albumsListDivUl.appendChild(liElement);
		}
	}
	createAlbumsListPreviews();
}, 100);