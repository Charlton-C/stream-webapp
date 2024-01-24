// To ensure fetch loads the audio information
setTimeout(() =>{
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



	var expandLibraryButton = document.querySelector("#music_side-library");
	var expandSongsButton = document.querySelector(".expand-songs-div");
	var expandAlbumsButton = document.querySelector(".expand-albums-div");
	var previewSongsDivUl = document.querySelector(".songs-ul");
	var previewAlbumsDivUl = document.querySelector(".albums-ul");
	var songsListDivUl = document.querySelector(".songs_list_div-ul");
	var albumsListDivUl = document.querySelector(".albums_list_div-ul");
	var specificAlbumListDivOl = document.querySelector(".specific_album_list_div-ol");
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
	var volumeLevelBar = document.querySelector(".volume-level-bar");
	var songsArray = [];
	var albumsDictionary = {};
	var isASongPlaying = false;
	var isCurrentPlayingSongMute = false;
	var isCurrentPlayingSongPlayingFromAnAlbum;
	var playingAlbumQueue = [];
	var updateSongProgressInterval = null;
	var playingSongNumber = 1;
	var numberOfSongs = 10;
	var numberOfAlbums = Object.keys(albumsInfo).length;
	var albumsArray = [];
	

	
	// Set songs in the songs array
	for(let i = 1; i <= numberOfSongs; i++){
		songsArray[i] = new Audio("/songs/"+i+".mp3");
	}
	

	
	// Function to add album names and album index to the albumsArray when the website loads
	function changeAlbumInfoDictionaryToAlbumsArray(){
		for(let key in albumsInfo){
			albumsArray.push([key, albumsInfo[key]]);
		}
	}
	changeAlbumInfoDictionaryToAlbumsArray();
	
	
	
	// Show the songs preview page when the user clicks the library button
	expandLibraryButton.addEventListener("click", () => {
		document.querySelector(".songs_list_div").style.display = "none";
		document.querySelector(".albums_list_div").style.display = "none";
		document.querySelector(".specific_album_list_div").style.display = "none";
		document.querySelector(".music_div").style.display = "block";
		expandLibraryButton.style.color = "rgb(42, 231, 241)";
		expandLibraryButton.style.textDecoration = "underline";
	});
	
	
	// Show the songs list page when the user clicks the songs button
	expandSongsButton.addEventListener("click", () => {
		document.querySelector(".music_div").style.display = "none";
		document.querySelector(".songs_list_div").style.display = "block";
		expandLibraryButton.style.color = "rgb(106, 107, 111)";
		expandLibraryButton.style.textDecoration = "none";
	});
	
	
	// Show the albums list page when the user clicks the albums button
	expandAlbumsButton.addEventListener("click", () => {
		document.querySelector(".music_div").style.display = "none";
		document.querySelector(".albums_list_div").style.display = "block";
		expandLibraryButton.style.color = "rgb(106, 107, 111)";
		expandLibraryButton.style.textDecoration = "none";
	});
	
	
	// Function to create the song previews when the website loads
	function createSongsPreviews(){
		var loopCount = 1;
		var intervalVariable = setInterval(()=>{
			var songNumber = loopCount.toString();
			ID3.loadTags("/songs/"+songNumber+".mp3", () => {
				var tags = ID3.getAllTags("/songs/"+songNumber+".mp3");
				var liElement = document.createElement("li");
				liElement.setAttribute("class", "song-"+songNumber+"-preview-item");
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
					liElementDivImg.setAttribute("src", "/resources/images/no-image.png");
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
						document.querySelector("[class='song-"+songNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						document.querySelector("[class='song-"+songNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						playOrPauseSongButton.classList.toggle("bi-play-fill");
						playOrPauseSong(playingSongNumber, songNumber);
						updateSongProgress(songNumber, 1);
						isASongPlaying = true;
					}
					// To continue to play the same song
					else if(isASongPlaying == false && playingSongNumber == songNumber){
						document.querySelector("[class='song-"+songNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						document.querySelector("[class='song-"+songNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						playOrPauseSongButton.classList.toggle("bi-play-fill");
						playOrPauseSong(playingSongNumber, songNumber);
						updateSongProgress(songNumber, 1);
						isASongPlaying = true;
					}
					// To play a different song while another one is still playing(pause this other one)
					else if(isASongPlaying == true && playingSongNumber != songNumber){
						document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						document.querySelector("[class='song-"+songNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						document.querySelector("[class='song-"+songNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						updateSongProgress(playingSongNumber, 0);
						playOrPauseSong(playingSongNumber, songNumber);
						updateSongProgress(songNumber, 1);
					}
					// To pause a song
					else if(isASongPlaying == true && playingSongNumber == songNumber){
						document.querySelector("[class='song-"+songNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						document.querySelector("[class='song-"+songNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						playOrPauseSongButton.classList.toggle("bi-play-fill");
						playOrPauseSong(playingSongNumber, songNumber);
						updateSongProgress(playingSongNumber, 0);
						isASongPlaying = false;
					}
					else{}
					playingSongNumber = songNumber;
					isCurrentPlayingSongPlayingFromAlbum = false;
				});
	
	
				previewSongsDivUl.appendChild(liElement);
			}, {
				tags: ["picture", "title", "artist"]
			});
	
	
			loopCount++;
			if(loopCount > numberOfSongs){
				clearInterval(intervalVariable);
			}
		}, 80);
	}
	createSongsPreviews();
	
	
	// Function to create the song list when the website loads
	function createSongItemsInSongsListPage(){
		songsListDivUl.innerHTML = "";
		var loopCount = 1;
		var intervalVariable = setInterval(()=>{
			var songNumber = loopCount.toString();
			ID3.loadTags("/songs/"+songNumber+".mp3", () => {
				var tags = ID3.getAllTags("/songs/"+songNumber+".mp3");
				var liElement = document.createElement("li");
				liElement.setAttribute("class", "song-"+songNumber+"-list-item");
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
					liElementImg.setAttribute("src", "/resources/images/no-image.png");
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
				liElement.addEventListener("click", () => {
					playingSongImage.setAttribute("src", liElementImg.src);
					playingSongNameSpan.innerText = tags.title;
					playingSongArtistSpan.innerText = tags.artist;
				
					// Change image play or pause button to show whether a song is playing
					// To play the first song or to play a different song while the previous one is paused
					if(isASongPlaying == false && playingSongNumber != songNumber){
						liElementI.classList.toggle("bi-play-circle-fill");
						document.querySelector("[class='song-"+songNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						playOrPauseSongButton.classList.toggle("bi-play-fill");
						playOrPauseSong(playingSongNumber, songNumber);
						updateSongProgress(songNumber, 1);
						isASongPlaying = true;
					}
					// To continue to play the same song
					else if(isASongPlaying == false && playingSongNumber == songNumber){
						liElementI.classList.toggle("bi-play-circle-fill");
						document.querySelector("[class='song-"+songNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						playOrPauseSongButton.classList.toggle("bi-play-fill");
						playOrPauseSong(playingSongNumber, songNumber);
						updateSongProgress(songNumber, 1);
						isASongPlaying = true;
					}
					// To play a different song while another one is still playing(pause this other one)
					else if(isASongPlaying == true && playingSongNumber != songNumber){
						document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						liElementI.classList.toggle("bi-play-circle-fill");
						document.querySelector("[class='song-"+songNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						updateSongProgress(playingSongNumber, 0);
						playOrPauseSong(playingSongNumber, songNumber);
						updateSongProgress(songNumber, 1);
					}
					// To pause a song
					else if(isASongPlaying == true && playingSongNumber == songNumber){
						liElementI.classList.toggle("bi-play-circle-fill");
						document.querySelector("[class='song-"+songNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
						playOrPauseSongButton.classList.toggle("bi-play-fill");
						playOrPauseSong(playingSongNumber, songNumber);
						updateSongProgress(playingSongNumber, 0);
						isASongPlaying = false;
					}
					else{}
					playingSongNumber = songNumber;
					isCurrentPlayingSongPlayingFromAlbum = false;
				});
	
	
				songsListDivUl.appendChild(liElement);
			}, {
				tags: ["picture", "title", "artist"]
			});
	
	
			loopCount++;
			if(loopCount > numberOfSongs){
				clearInterval(intervalVariable);
			}
		}, 80);
	}
	createSongItemsInSongsListPage();
	
	
	// Function to create the albums previews when the website loads
	function createAlbumsPreviews(){
		var loopCount = 0;
		var albumName;
		var songNumberWithAlbumName;
		// Load the album previews
		var intervalVariable = setInterval(()=>{
			albumName = Object.keys(albumsDictionary)[loopCount];
			songNumberWithAlbumName = albumsDictionary[albumName][0];
			ID3.loadTags("/songs/"+songNumberWithAlbumName+".mp3", () => {
				var tags = ID3.getAllTags("/songs/"+songNumberWithAlbumName+".mp3");
				var liElement = document.createElement("li");
				liElement.setAttribute("class", "album-"+(loopCount+1)+"-preview-li");
				var liElementImg = document.createElement("img");
				liElementImg.setAttribute("class", "album_img");
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
					liElementImg.setAttribute("src", "/resources/images/no-image.png");
				}
				else {}
				var liElementH5 = document.createElement("h5");
				liElementH5.setAttribute("class", "album-"+(loopCount+1)+"-album-name");
				liElementH5.innerText = tags.album;
				var liElementH5Div = document.createElement("div");
				liElementH5Div.setAttribute("class", "subtitle album-"+(loopCount+1)+"-artist-name");
				liElementH5Div.innerText = tags.artist;
				liElementH5.appendChild(liElementH5Div);
				liElement.appendChild(liElementImg);
				liElement.appendChild(liElementH5);
				// Add click event listener for the album previews to open the album page when clicked
				liElement.addEventListener("click", () => {
					var albumNumber = (Number(liElement.classList[0].replace(/\D/g, ""))-2);
					albumName = Object.keys(albumsDictionary)[albumNumber];
					var loopCount2 = 0;
					specificAlbumListDivOl.innerHTML = "";
					document.querySelector(".music_div").style.display = "none";
					document.querySelector(".specific_album_list_div").style.display = "block";
					expandLibraryButton.style.color = "rgb(106, 107, 111)";
					expandLibraryButton.style.textDecoration = "none";
					var image = tags.picture;
					if(image){
						var base64String = "";
						for (var i = 0; i < image.data.length; i++){
							base64String += String.fromCharCode(image.data[i]);
						}
						var base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
						document.querySelector(".specific_album_image").src = base64;
					} else if(!image){
						document.querySelector(".specific_album_image").src = "/resources/images/no-image.png";
					}
					else {}
					document.querySelector(".specific_album_name > span").innerText = tags.album;
					document.querySelector(".specific_album_artist_name").innerText = tags.artist;
	
	
					// Load the songs on the album page
					var intervalVariable2 = setInterval(() => {
						var songNumber = albumsDictionary[albumName][loopCount2];
						ID3.loadTags("/songs/"+songNumber+".mp3", () => {
							tags = ID3.getAllTags("/songs/"+songNumber+".mp3");
							var liElement = document.createElement("li");
							liElement.setAttribute("class", "specific_album_song-"+(loopCount2+1)+"-li song-"+songNumber+"-specific_album_list-li");
							var liElementImg = document.createElement("img");
							// Get image from metadata and add it to the img tag
							if(image){
								var base64String = "";
								for (var i = 0; i < image.data.length; i++){
									base64String += String.fromCharCode(image.data[i]);
								}
								var base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
								liElementImg.setAttribute("src", base64);
							} else if(!image){
								liElementImg.setAttribute("src", "/resources/images/no-image.png");
							}
							else {}
							var liElementH5 = document.createElement("h5");
							liElementH5.setAttribute("class", "specific_album_song-"+(loopCount2+1)+"-name");
							liElementH5.innerText = tags.title;
							var liElementH5Div = document.createElement("div");
							liElementH5Div.setAttribute("class", "subtitle specific_album_song-"+(loopCount2+1)+"-artist");
							liElementH5Div.innerText = tags.artist;
							liElementH5.appendChild(liElementH5Div);
							var liElementI = document.createElement("i");
							liElementI.setAttribute("class", "bi bi-play-circle-fill bi-pause-circle-fill");
							liElementI.setAttribute("id", "2");
							liElement.appendChild(liElementImg);
							liElement.appendChild(liElementH5);
							liElement.appendChild(liElementI);
							liElement.addEventListener("click", () => {
								playingSongImage.setAttribute("src", liElementImg.src);
								playingSongNameSpan.innerText = tags.title;
								playingSongArtistSpan.innerText = tags.artist;
							
								// Change image play or pause button to show whether a song is playing
								// To play the first song or to play a different song while the previous one is paused
								if(isASongPlaying == false && playingSongNumber != songNumber){
									liElementI.classList.toggle("bi-play-circle-fill");
									document.querySelector("[class='song-"+songNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
									document.querySelector("[class='song-"+songNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
									playOrPauseSongButton.classList.toggle("bi-play-fill");
									playOrPauseSong(playingSongNumber, songNumber);
									updateSongProgress(songNumber, 1);
									isASongPlaying = true;
								}
								// To continue to play the same song
								else if(isASongPlaying == false && playingSongNumber == songNumber){
									liElementI.classList.toggle("bi-play-circle-fill");
									document.querySelector("[class='song-"+songNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
									document.querySelector("[class='song-"+songNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
									playOrPauseSongButton.classList.toggle("bi-play-fill");
									playOrPauseSong(playingSongNumber, songNumber);
									updateSongProgress(songNumber, 1);
									isASongPlaying = true;
								}
								// To play a different song while another one is still playing(pause this other one)
								else if(isASongPlaying == true && playingSongNumber != songNumber){
									document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
									document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
									liElementI.classList.toggle("bi-play-circle-fill");
									document.querySelector("[class='song-"+songNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
									document.querySelector("[class='song-"+songNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
									updateSongProgress(playingSongNumber, 0);
									playOrPauseSong(playingSongNumber, songNumber);
									updateSongProgress(songNumber, 1);
								}
								// To pause a song
								else if(isASongPlaying == true && playingSongNumber == songNumber){
									liElementI.classList.toggle("bi-play-circle-fill");
									document.querySelector("[class='song-"+songNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
									document.querySelector("[class='song-"+songNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
									playOrPauseSongButton.classList.toggle("bi-play-fill");
									playOrPauseSong(playingSongNumber, songNumber);
									updateSongProgress(playingSongNumber, 0);
									isASongPlaying = false;
								}
								else{}
								playingSongNumber = songNumber;
								isCurrentPlayingSongPlayingFromAlbum = true;
							});
	
	
							specificAlbumListDivOl.appendChild(liElement);
	
	
							// To change the play, pause status of a song in the album if the song is playing
							var numberOfLiItemsInspecificAlbumListDivOl = document.querySelectorAll(".specific_album_list_div-ol > li").length;
							for(var i = 0; i < numberOfLiItemsInspecificAlbumListDivOl; i++){
								if(!document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.contains("bi-play-circle-fill") && document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > img").src == document.querySelector(".specific_album_image").src){
									document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
								}
							}
						}, {
							tags: ["picture", "album", "artist"]
						});
	
	
						loopCount2++;
	
	
						if(albumsDictionary[albumName][loopCount2] == undefined){
							clearInterval(intervalVariable2);
						}
	
					}, 80);
				});
				
				previewAlbumsDivUl.appendChild(liElement);
			}, {
				tags: ["picture", "album", "artist"]
			});
	
			
			loopCount++;
			if(loopCount == (Object.keys(albumsDictionary).length)){
				clearInterval(intervalVariable);
			}
		}, 80);
	}
	createAlbumsPreviews();
	
	
	// Change current song position when the user slides the current playing song slider
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
	
	
	// Function to change the current song progress info every second
	function updateSongProgress(playingSongNumber, turnOnOrOff){
		var currentSong = songsArray[playingSongNumber];
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
	previousSongButton.addEventListener("click", () => {
		// No song plays as the user has not selected a song
		if(playingSongNameSpan.innerText == ""){}
		// To play the previous song when the user is currently listening to another song
		else if(playingSongNameSpan.innerText != "" && playingSongNumber > 1 && isASongPlaying == true){
			// To pause the current playing song
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			playOrPauseSongButton.classList.toggle("bi-play-fill");
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 0);
			isASongPlaying = false;
			playingSongNumber = Number(playingSongNumber) - 1;
			songsArray[playingSongNumber].currentTime = 0;
			// To play the next song
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
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
					playingSongImage.setAttribute("src", "/resources/images/no-image.png");
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
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
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
					playingSongImage.setAttribute("src", "/resources/images/no-image.png");
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
	
	
	// Play or pause current song button function
	playOrPauseSongButton.addEventListener("click", () => {
		// No song plays as the user has not selected a song
		if(playingSongNameSpan.innerText == ""){}
		// To pause the current playing song
		else if(playingSongNameSpan.innerText != "" && playingSongNumber != 0 && isASongPlaying == true){
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			playOrPauseSongButton.classList.toggle("bi-play-fill");
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 0);
			isASongPlaying = false;
		}
		// To play the current playing song
		else if(playingSongNameSpan.innerText != "" && playingSongNumber != 0 && isASongPlaying == false){
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			playOrPauseSongButton.classList.toggle("bi-play-fill");
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 1);
			isASongPlaying = true;
		}
		else{}
	});
	
	
	// Go to the next song button function
	nextSongButton.addEventListener("click", () => {
		// No song plays as the user has not selected a song
		if(playingSongNameSpan.innerText == ""){}
		// To play the next song when the user is listening to the currently playing song
		else if(playingSongNameSpan.innerText != "" && playingSongNumber != 0 && isASongPlaying == true && playingSongNumber < numberOfSongs){
			// To pause the current playing song
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			playOrPauseSongButton.classList.toggle("bi-play-fill");
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 0);
			isASongPlaying = false;
			if(isCurrentPlayingSongPlayingFromAlbum == false){
				playingSongNumber = Number(playingSongNumber) + 1;
			}
			else if(isCurrentPlayingSongPlayingFromAlbum == true){
				var albumName = Object.keys(albumsDictionary).find(key => albumsDictionary[key][0] == playingSongNumber);
				var songIndexInAlbumArray = albumsDictionary[albumName].indexOf(playingSongNumber);
				if(albumsDictionary[albumName][songIndexInAlbumArray+1] != undefined){
					playingSongNumber = albumsDictionary[albumName][songIndexInAlbumArray+1];
				}
			}
			else{}
			songsArray[playingSongNumber].currentTime = 0;
			// To play the next song
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
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
					playingSongImage.setAttribute("src", "/resources/images/no-image.png");
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
			if(isCurrentPlayingSongPlayingFromAlbum == false){
				playingSongNumber = Number(playingSongNumber) + 1;
			}
			else if(isCurrentPlayingSongPlayingFromAlbum == true){}
			else{}
			songsArray[playingSongNumber].currentTime = 0;
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
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
					playingSongImage.setAttribute("src", "/resources/images/no-image.png");
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
	
	
	// Download current song button function
	downloadSongButton.addEventListener("click", ()=>{
		var aElement = document.createElement("a");
		aElement.setAttribute("href", "/songs/"+playingSongNumber+".mp3");
		aElement.download = playingSongNameSpan.innerText;
		aElement.click();
	});
	
	
	// Mute or unmute current song button function
	volumeButton.addEventListener("click", ()=>{
		if(isCurrentPlayingSongMute == false){
			songsArray[playingSongNumber].volume = 0.0;
			isCurrentPlayingSongMute = true;
		}
		else if(isCurrentPlayingSongMute == true){
			songsArray[playingSongNumber].volume = 1.0;
			isCurrentPlayingSongMute = false;
		}
		else{}
	});
	
	
	// Change current song volume when the user slides the current playing song volume slider
	volumeLevelBar.addEventListener("change", ()=>{
		songsArray[playingSongNumber].volume = (volumeLevelBar.value/100);
	});
	
	
	// Play or pause current song function
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
	
	
	// Update song time progress function
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
	
	
	// Update song slider position function
	function updateSongProgressBar(currentSong){
		playingSongProgressBar.value = ((currentSong.currentTime/currentSong.duration)*100);
	}
	
	
	// Play next song when current song ends
	function playNextSongWhenCurrentSongEnds(currentSong){
		if(currentSong.currentTime == currentSong.duration && playingSongNumber < numberOfSongs){
			// To pause and end the current song progress update
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 0);
			isASongPlaying = false;
			// To play the next song
			playingSongNumber = Number(playingSongNumber) + 1;
			songsArray[playingSongNumber].currentTime = 0;
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
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
					playingSongImage.setAttribute("src", "/resources/images/no-image.png");
				}
				else {}
				playingSongNameSpan.innerText = tags.title;
				playingSongArtistSpan.innerText = tags.artist;
			});
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 1);
			isASongPlaying = true;
		}
		// To end songs playing when played the last song available
		else if(currentSong.currentTime == currentSong.duration && playingSongNumber == numberOfSongs){
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 0);
			isASongPlaying = false;
		}
		else{}
	}

}, 100);