// import songsInfo from "/resources/songAudioInfo/json/songsInfo.json" assert {type:"json"}
// import albumsInfo from "/resources/songAudioInfo/json/albumsInfo.json" assert {type:"json"}
// import artistsInfo from "/resources/songAudioInfo/json/artistsInfo.json" assert {type:"json"}
// To view optimal way to access the data
// Remove after use



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



// setTimeout(() => {
// 	console.log(songsInfo);
// 	console.log(albumsInfo);
// 	console.log(artistsInfo);
// }, 100);


setTimeout(() => {

	
	console.log(songsInfo);
	console.log(albumsInfo);
	console.log(artistsInfo);
	
	
	
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
		console.log(albumsArray);
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
		for(let songNumber = 1; songNumber <= numberOfSongs; songNumber++){
			let liElement = document.createElement("li");
			liElement.setAttribute("class", "song-"+songNumber+"-preview-item");
			let liElementDiv = document.createElement("div");
			liElementDiv.setAttribute("class", "img_play");
			let liElementDivImg = document.createElement("img");
			liElementDivImg.setAttribute("src", "/resources/images/songImages/"+songNumber+".png");
			liElementDivImg.onerror = () => {
				liElementDivImg.src = "/resources/images/songImages/"+songNumber+".jpeg";
			};
			let liElementDivI = document.createElement("i");
			liElementDivI.setAttribute("class", "bi bi-play-circle-fill bi-pause-circle-fill");
			liElementDivI.setAttribute("id", "2");
			liElementDiv.appendChild(liElementDivImg);
			liElementDiv.appendChild(liElementDivI);
			let liElementH5 = document.createElement("h5");
			liElementH5.setAttribute("class", "song-"+songNumber+"-song-name");
			liElementH5.innerText = songsInfo[songNumber.toString()][0];
			let br = document.createElement("br");
			let liElementH5Div = document.createElement("div");
			liElementH5Div.setAttribute("class", "subtitle song-"+songNumber+"-artist-name");
			liElementH5Div.innerText = songsInfo[songNumber.toString()][1];
			liElementH5.appendChild(br);
			liElementH5.appendChild(liElementH5Div);
			liElement.appendChild(liElementDiv);
			liElement.appendChild(liElementH5);
			liElement.addEventListener("click", () => {
				playingSongImage.setAttribute("src", liElementDivImg.src);
				playingSongNameSpan.innerText = songsInfo[songNumber.toString()][0];
				playingSongArtistSpan.innerText = songsInfo[songNumber.toString()][1];
			
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
				isCurrentPlayingSongPlayingFromAnAlbum = false;
				playingAlbumQueue = [];
			});
	
	
			previewSongsDivUl.appendChild(liElement);
		}
	}
	createSongsPreviews();
	
	
	// Function to create the song list when the website loads
	function createSongItemsInSongsListPage(){
		songsListDivUl.innerHTML = "";
		for(let songNumber = 1; songNumber <= numberOfSongs; songNumber++){
			let liElement = document.createElement("li");
			liElement.setAttribute("class", "song-"+songNumber+"-list-item");
			let liElementImg = document.createElement("img");
			liElementImg.setAttribute("src", "/resources/images/songImages/"+songNumber+".png");
			liElementImg.onerror = () => {
				liElementImg.src = "/resources/images/songImages/"+songNumber+".jpeg";
			};
			let liElementH5 = document.createElement("h5");
			liElementH5.setAttribute("class", "song-"+songNumber+"-song-name");
			liElementH5.innerText = songsInfo[songNumber.toString()][0];
			let br = document.createElement("br");
			liElementH5.appendChild(br);
			let liElementH5Div = document.createElement("div");
			liElementH5Div.setAttribute("class", "subtitle song-"+songNumber+"-artist-name");
			liElementH5Div.innerText = songsInfo[songNumber.toString()][1];
			liElementH5.appendChild(liElementH5Div);
			let liElementI = document.createElement("i");
			liElementI.setAttribute("class", "bi bi-play-circle-fill bi-pause-circle-fill");
			liElementI.setAttribute("id", "2");
			liElement.appendChild(liElementImg);
			liElement.appendChild(liElementH5);
			liElement.appendChild(liElementI);
			liElement.addEventListener("click", () => {
				playingSongImage.setAttribute("src", liElementImg.src);
				playingSongNameSpan.innerText = songsInfo[songNumber.toString()][0];
				playingSongArtistSpan.innerText = songsInfo[songNumber.toString()][1];
			
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
				isCurrentPlayingSongPlayingFromAnAlbum = false;
				playingAlbumQueue = [];
			});
	
	
			songsListDivUl.appendChild(liElement);
		}
	}
	createSongItemsInSongsListPage();
	
	
	// Function to create the albums previews when the website loads
	function createAlbumsPreviews(){
		for(let albumNumber = 1; albumNumber <= numberOfAlbums; albumNumber++){
			let liElement = document.createElement("li");
			liElement.setAttribute("class", "album-"+albumNumber+"-preview-li");
			let liElementImg = document.createElement("img");
			liElementImg.setAttribute("class", "album_img");
			liElementImg.setAttribute("src", "/resources/images/albumImages/"+albumNumber+".png");
			liElementImg.onerror = () => {
				liElementImg.src = "/resources/images/albumImages/"+albumNumber+".jpeg";
			};
			let liElementH5 = document.createElement("h5");
			liElementH5.setAttribute("class", "album-"+albumNumber+"-album-name");
			liElementH5.innerText = albumsArray[albumNumber-1][0];
			let liElementH5Div = document.createElement("div");
			liElementH5Div.setAttribute("class", "subtitle album-"+(albumNumber+1)+"-artist-name");
			liElementH5Div.innerText = albumsArray[albumNumber-1][1][0];
			liElementH5.appendChild(liElementH5Div);
			liElement.appendChild(liElementImg);
			liElement.appendChild(liElementH5);
	
			// Add click event listener for the album previews to open the album page when clicked
			liElement.addEventListener("click", () => {
				let albumNumber = (Number(liElement.classList[0].replace(/\D/g, "")));
				specificAlbumListDivOl.innerHTML = "";
				document.querySelector(".music_div").style.display = "none";
				document.querySelector(".specific_album_list_div").style.display = "block";
				expandLibraryButton.style.color = "rgb(106, 107, 111)";
				expandLibraryButton.style.textDecoration = "none";
				document.querySelector(".specific_album_image").src = liElementImg.src;
				document.querySelector(".specific_album_name > span").innerText = albumsArray[albumNumber-1][0];
				document.querySelector(".specific_album_artist_name").innerText = albumsArray[albumNumber-1][1][0];
	
	
				// Load the songs on the album page
				for(let songNumberInAlbum = 0; songNumberInAlbum < (albumsArray[albumNumber-1][1][1]).length; songNumberInAlbum++){
					let songNumber = albumsArray[albumNumber-1][1][1][songNumberInAlbum];
					let liElement = document.createElement("li");
					liElement.setAttribute("class", "specific_album_song-"+(songNumberInAlbum+1)+"-li song-"+songNumber+"-specific_album_list-li");
					let liElementImg = document.createElement("img");
					liElementImg.setAttribute("src", "/resources/images/songImages/"+songNumber+".png");
					liElementImg.onerror = () => {
						liElementImg.src = "/resources/images/songImages/"+songNumber+".jpeg";
					};
					let liElementH5 = document.createElement("h5");
					liElementH5.setAttribute("class", "specific_album_song-"+(songNumberInAlbum+1)+"-name");
					liElementH5.innerText = songsInfo[songNumber][0];
					let liElementH5Div = document.createElement("div");
					liElementH5Div.setAttribute("class", "subtitle specific_album_song-"+(songNumberInAlbum+1)+"-artist");
					liElementH5Div.innerText = songsInfo[songNumber][1];
					liElementH5.appendChild(liElementH5Div);
					let liElementI = document.createElement("i");
					liElementI.setAttribute("class", "bi bi-play-circle-fill bi-pause-circle-fill");
					liElementI.setAttribute("id", "2");
					liElement.appendChild(liElementImg);
					liElement.appendChild(liElementH5);
					liElement.appendChild(liElementI);
					liElement.addEventListener("click", () => {
						playingSongImage.setAttribute("src", liElementImg.src);
						playingSongNameSpan.innerText = songsInfo[songNumber][0];
						playingSongArtistSpan.innerText = songsInfo[songNumber][1];
					
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
							document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
							document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
							if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
								document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
							}
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
						isCurrentPlayingSongPlayingFromAnAlbum = true;
						for(let numberOfSongsToAddToPlayingAlbumQueue = 0; numberOfSongsToAddToPlayingAlbumQueue < (albumsArray[albumNumber-1][1]).length; numberOfSongsToAddToPlayingAlbumQueue++){
							playingAlbumQueue = albumsArray[albumNumber-1][1][numberOfSongsToAddToPlayingAlbumQueue];
						}
					});
	
	
					specificAlbumListDivOl.appendChild(liElement);
				}
	
	
				// To change the play, pause status of a song in the album if the song is playing
				for(let i = 0; i < (albumsArray[albumNumber-1][1][1]).length; i++){
					if(!document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.contains("bi-play-circle-fill") && document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
						document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
					}
				}
			});
			
	
			previewAlbumsDivUl.appendChild(liElement);
		}
	}
	createAlbumsPreviews();
	
	
	
	// Function to create the albums previews when the website loads
	function createAlbumListPreviews(){
		for(let albumNumber = 1; albumNumber <= numberOfAlbums; albumNumber++){
			let liElement = document.createElement("li");
			liElement.setAttribute("class", "album-"+albumNumber+"-album-li-item");
			let liElementImg = document.createElement("img");
			liElementImg.setAttribute("class", "album_img");
			liElementImg.setAttribute("src", "/resources/images/albumImages/"+albumNumber+".png");
			liElementImg.onerror = () => {
				liElementImg.src = "/resources/images/albumImages/"+albumNumber+".jpeg";
			};
			let liElementH5 = document.createElement("h5");
			liElementH5.setAttribute("class", "album-"+albumNumber+"-album-name");
			liElementH5.innerText = albumsArray[albumNumber-1][0];
			let liElementH5Div = document.createElement("div");
			liElementH5Div.setAttribute("class", "subtitle album-"+(albumNumber+1)+"-artist-name");
			liElementH5Div.innerText = albumsArray[albumNumber-1][1][0];
			liElementH5.appendChild(liElementH5Div);
			liElement.appendChild(liElementImg);
			liElement.appendChild(liElementH5);
	
			// Add click event listener for the album previews to open the album page when clicked
			liElement.addEventListener("click", () => {
				let albumNumber = (Number(liElement.classList[0].replace(/\D/g, "")));
				specificAlbumListDivOl.innerHTML = "";
				document.querySelector(".albums_list_div").style.display = "none";
				document.querySelector(".specific_album_list_div").style.display = "block";
				expandLibraryButton.style.color = "rgb(106, 107, 111)";
				expandLibraryButton.style.textDecoration = "none";
				document.querySelector(".specific_album_image").src = liElementImg.src;
				document.querySelector(".specific_album_name > span").innerText = albumsArray[albumNumber-1][0];
				document.querySelector(".specific_album_artist_name").innerText = albumsArray[albumNumber-1][1][0];
	
	
				// Load the songs on the album page
				for(let songNumberInAlbum = 0; songNumberInAlbum < (albumsArray[albumNumber-1][1][1]).length; songNumberInAlbum++){
					let songNumber = albumsArray[albumNumber-1][1][1][songNumberInAlbum];
					let liElement = document.createElement("li");
					liElement.setAttribute("class", "specific_album_song-"+(songNumberInAlbum+1)+"-li song-"+songNumber+"-specific_album_list-li");
					let liElementImg = document.createElement("img");
					liElementImg.setAttribute("src", "/resources/images/songImages/"+songNumber+".png");
					liElementImg.onerror = () => {
						liElementImg.src = "/resources/images/songImages/"+songNumber+".jpeg";
					};
					let liElementH5 = document.createElement("h5");
					liElementH5.setAttribute("class", "specific_album_song-"+(songNumberInAlbum+1)+"-name");
					liElementH5.innerText = songsInfo[songNumber][0];
					let liElementH5Div = document.createElement("div");
					liElementH5Div.setAttribute("class", "subtitle specific_album_song-"+(songNumberInAlbum+1)+"-artist");
					liElementH5Div.innerText = songsInfo[songNumber][1];
					liElementH5.appendChild(liElementH5Div);
					let liElementI = document.createElement("i");
					liElementI.setAttribute("class", "bi bi-play-circle-fill bi-pause-circle-fill");
					liElementI.setAttribute("id", "2");
					liElement.appendChild(liElementImg);
					liElement.appendChild(liElementH5);
					liElement.appendChild(liElementI);
					liElement.addEventListener("click", () => {
						playingSongImage.setAttribute("src", liElementImg.src);
						playingSongNameSpan.innerText = songsInfo[songNumber][0];
						playingSongArtistSpan.innerText = songsInfo[songNumber][1];
					
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
							document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
							document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
							if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
								document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
							}
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
						isCurrentPlayingSongPlayingFromAnAlbum = true;
						for(let numberOfSongsToAddToPlayingAlbumQueue = 0; numberOfSongsToAddToPlayingAlbumQueue < (albumsArray[albumNumber-1][1]).length; numberOfSongsToAddToPlayingAlbumQueue++){
							playingAlbumQueue = albumsArray[albumNumber-1][1][numberOfSongsToAddToPlayingAlbumQueue];
						}
					});
	
	
					specificAlbumListDivOl.appendChild(liElement);
				}
	
	
				// To change the play, pause status of a song in the album if the song is playing
				for(let i = 0; i < (albumsArray[albumNumber-1][1][1]).length; i++){
					if(!document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.contains("bi-play-circle-fill") && document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
						document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
					}
				}
			});
			
	
			albumsListDivUl.appendChild(liElement);
		}
	}
	createAlbumListPreviews();
	
	
	
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
	previousSongButton.addEventListener("click", () => {
		// No song plays as the user has not selected a song
		if(playingSongNameSpan.innerText == ""){}
		// To play the previous song when the user is currently listening to another song
		else if(playingSongNameSpan.innerText != "" && playingSongNumber > 1 && isASongPlaying == true){
			// To pause the current playing song
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
				document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			}
			playOrPauseSongButton.classList.toggle("bi-play-fill");
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
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
				document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			}
			playOrPauseSongButton.classList.toggle("bi-play-fill");
			playingSongImage.setAttribute("src", "/resources/images/songImages/"+playingSongNumber+".png");
			playingSongImage.onerror = () => {
				playingSongImage.src = "/resources/images/songImages/"+playingSongNumber+".jpeg";
			};
			playingSongNameSpan.innerText = songsInfo[playingSongNumber][0];
			playingSongArtistSpan.innerText = songsInfo[playingSongNumber][1];
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 1);
			isASongPlaying = true;
		}
		// To play the previous song when the user has paused the currently listening to song
		else if(playingSongNameSpan.innerText != "" && playingSongNumber > 1 && isASongPlaying == false){
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
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
				document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			}
			playOrPauseSongButton.classList.toggle("bi-play-fill");
			playingSongImage.setAttribute("src", "/resources/images/songImages/"+playingSongNumber+".png");
			playingSongImage.onerror = () => {
				playingSongImage.src = "/resources/images/songImages/"+playingSongNumber+".jpeg";
			};
			playingSongNameSpan.innerText = songsInfo[playingSongNumber][0];
			playingSongArtistSpan.innerText = songsInfo[playingSongNumber][1];
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
			if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
				document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			}
			playOrPauseSongButton.classList.toggle("bi-play-fill");
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 0);
			isASongPlaying = false;
		}
		// To play the current playing song
		else if(playingSongNameSpan.innerText != "" && playingSongNumber != 0 && isASongPlaying == false){
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
				document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			}
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
			if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
				document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			}
			playOrPauseSongButton.classList.toggle("bi-play-fill");
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
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
				document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			}
			playOrPauseSongButton.classList.toggle("bi-play-fill");
			playingSongImage.setAttribute("src", "/resources/images/songImages/"+playingSongNumber+".png");
			playingSongImage.onerror = () => {
				playingSongImage.src = "/resources/images/songImages/"+playingSongNumber+".jpeg";
			};
			playingSongNameSpan.innerText = songsInfo[playingSongNumber][0];
			playingSongArtistSpan.innerText = songsInfo[playingSongNumber][1];
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 1);
			isASongPlaying = true;
		}
		// To play the next song when the user has paused the currently playing song
		else if(playingSongNameSpan.innerText != "" && playingSongNumber != 0 && isASongPlaying == false && playingSongNumber < numberOfSongs){
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
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
				document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			}
			playOrPauseSongButton.classList.toggle("bi-play-fill");
			playingSongImage.setAttribute("src", "/resources/images/songImages/"+playingSongNumber+".png");
			playingSongImage.onerror = () => {
				playingSongImage.src = "/resources/images/songImages/"+playingSongNumber+".jpeg";
			};
			playingSongNameSpan.innerText = songsInfo[playingSongNumber][0];
			playingSongArtistSpan.innerText = songsInfo[playingSongNumber][1];
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 1);
			isASongPlaying = true;
		}
		// To restart the current song when their is no next song to play and their is a song playing
		else if(playingSongNameSpan.innerText != "" && playingSongNumber != 0 && isASongPlaying == true && playingSongNumber == numberOfSongs){
			// To restart the current song
			songsArray[playingSongNumber].currentTime = 0;
		}
		// To restart the current song when their is no next song to play and their isn't a song playing
		else if(playingSongNameSpan.innerText != "" && playingSongNumber != 0 && isASongPlaying == false && playingSongNumber == numberOfSongs){
			// To restart the current song
			songsArray[playingSongNumber].currentTime = 0;
			document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
				document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
			}
			playOrPauseSongButton.classList.toggle("bi-play-fill");
			playOrPauseSong(playingSongNumber, playingSongNumber);
			updateSongProgress(playingSongNumber, 1);
			isASongPlaying = true;
		}
		else{}
	});
	
	
	// Download current song button function
	downloadSongButton.addEventListener("click", ()=>{
		let aElement = document.createElement("a");
		aElement.setAttribute("href", "/songs/"+playingSongNumber+".mp3");
		aElement.download = (playingSongNameSpan.innerText+"-"+playingSongArtistSpan.innerText).replace(/\s/g, "-");
		document.body.appendChild(aElement);
		aElement.click();
		document.body.removeChild(aElement);
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
		if(isCurrentPlayingSongPlayingFromAnAlbum == false){
			if(currentSong.currentTime == currentSong.duration && playingSongNumber < numberOfSongs){
				// To pause and end the current song progress update
				document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
					document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
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
				document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
					document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				}
				playingSongImage.setAttribute("src", "/resources/images/songImages/"+playingSongNumber+".png");
				playingSongImage.onerror = () => {
					playingSongImage.src = "/resources/images/songImages/"+playingSongNumber+".jpeg";
				};
				playingSongNameSpan.innerText = songsInfo[playingSongNumber][0];
				playingSongArtistSpan.innerText = songsInfo[playingSongNumber][1];
				playOrPauseSong(playingSongNumber, playingSongNumber);
				updateSongProgress(playingSongNumber, 1);
				isASongPlaying = true;
			}
			// To end songs playing when played the last song available either on songs list or album
			else if(currentSong.currentTime == currentSong.duration && playingSongNumber == numberOfSongs){
				playOrPauseSong(playingSongNumber, playingSongNumber);
				updateSongProgress(playingSongNumber, 0);
				document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
					document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				}
				playOrPauseSongButton.classList.toggle("bi-play-fill");
				isASongPlaying = false;
			}
			else{}
		}
		else if(isCurrentPlayingSongPlayingFromAnAlbum == true){
			if(currentSong.currentTime == currentSong.duration && playingAlbumQueue.indexOf(playingSongNumber) < playingAlbumQueue.indexOf(playingAlbumQueue[Number(playingAlbumQueue.length - 1)])){
				// To pause and end the current song progress update
				document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
					document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
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
				document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
					document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				}
				playingSongImage.setAttribute("src", "/resources/images/songImages/"+playingSongNumber+".png");
				playingSongImage.onerror = () => {
					playingSongImage.src = "/resources/images/songImages/"+playingSongNumber+".jpeg";
				};
				playingSongNameSpan.innerText = songsInfo[playingSongNumber][0];
				playingSongArtistSpan.innerText = songsInfo[playingSongNumber][1];
				playOrPauseSong(playingSongNumber, playingSongNumber);
				updateSongProgress(playingSongNumber, 1);
				isASongPlaying = true;
			}
			// To end songs playing when played the last song available either on songs list or album
			else if(currentSong.currentTime == currentSong.duration && playingSongNumber == playingAlbumQueue[Number(playingAlbumQueue.length - 1)]){
				playOrPauseSong(playingSongNumber, playingSongNumber);
				updateSongProgress(playingSongNumber, 0);
				document.querySelector("[class='song-"+playingSongNumber+"-preview-item'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				document.querySelector("[class='song-"+playingSongNumber+"-list-item'] .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				if(document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill")){
					document.querySelector(".song-"+playingSongNumber+"-specific_album_list-li > .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				}
				playOrPauseSongButton.classList.toggle("bi-play-fill");
				isASongPlaying = false;
			}
			else{}
		}
		else{}
	}
}, 100);