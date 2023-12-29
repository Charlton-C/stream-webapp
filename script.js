var expandLibraryButton = document.querySelector("#music_side-library");
var expandSongsButton = document.querySelector(".expand-songs-div");
var previewSongsDivUl = document.querySelector(".songs-ul");
var songsListDivUl = document.querySelector(".songs_list_div-ul");


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


function createSongsPreviews(){
	var loopCount = 1;
	var intervalVariable = setInterval(()=>{
		var songNumber = loopCount.toString();
		ID3.loadTags("/songs/"+songNumber+".mp3", () => {
			var tags = ID3.getAllTags("/songs/"+songNumber+".mp3");
			var liElement = document.createElement("li");
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
			liElementDivI.setAttribute("class", "bi playListPlay bi-play-circle-fill");
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
			liElementI.setAttribute("class", "bi playListPlay bi-play-circle-fill");
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