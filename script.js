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
var playingSongNumber = 0;
var isASongPlaying = false;


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


playOrPauseSongButton.addEventListener("click", () => {
	if(playingSongNameSpan.innerText == ""){}
	else if(playingSongNameSpan.innerText != "" && playingSongNumber != 0 && isASongPlaying == true){
		document.querySelector("[class='"+playingSongNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
		playOrPauseSongButton.classList.toggle("bi-play-fill");
		isASongPlaying = false;
	}
	else if(playingSongNameSpan.innerText != "" && playingSongNumber != 0 && isASongPlaying == false){
		document.querySelector("[class='"+playingSongNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
		playOrPauseSongButton.classList.toggle("bi-play-fill");
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
				if(isASongPlaying == false && playingSongNumber != songNumber){
					document.querySelector("[class='"+songNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
					playOrPauseSongButton.classList.toggle("bi-play-fill");
					isASongPlaying = true;
				}
				else if(isASongPlaying == false && playingSongNumber == songNumber){
					document.querySelector("[class='"+songNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
					playOrPauseSongButton.classList.toggle("bi-play-fill");
					isASongPlaying = true;
				}
				else if(isASongPlaying == true && playingSongNumber != songNumber){
					document.querySelector("[class='"+playingSongNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
					document.querySelector("[class='"+songNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
				}
				else if(isASongPlaying == true && playingSongNumber == songNumber){
					document.querySelector("[class='"+songNumber+"'] .img_play .bi-pause-circle-fill").classList.toggle("bi-play-circle-fill");
					playOrPauseSongButton.classList.toggle("bi-play-fill");
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
		if(loopCount > 10){
			clearInterval(intervalVariable);
		}
	}, 25);
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
		if(loopCount > 10){
			clearInterval(intervalVariable);
		}
	}, 25);
}