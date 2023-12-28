var expandLibraryButton = document.querySelector("#music_side-library");
var expandSongsButton = document.querySelector(".expand-songs-div");
var previewSongsDiv = document.querySelector(".songs");


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
});


function createSongsPreview(){
	var liElement = document.createElement("li");
	var liElementDiv = document.createElement("div");
	liElementDiv.setAttribute("class", "img_play");
	var liElementDivImg = document.createElement("img");
	liElementDivImg.setAttribute("src", "/resources/drifting.jpg");
	var liElementDivI = document.createElement("i");
	liElementDivI.setAttribute("class", "bi playListPlay bi-play-circle-fill");
	liElementDivI.setAttribute("id", "2");
	liElementDiv.appendChild(liElementDivImg);
	liElementDiv.appendChild(liElementDivI);
	var liElementH5 = document.createElement("h5");
	liElementH5.setAttribute("class", "song-1-song-name");
	liElementH5.innerText = "Song name";
	var br = document.createElement("br");
	var liElementH5Div = document.createElement("div");
	liElementH5Div.setAttribute("class", "subtitle song-1-artist-name");
	liElementH5Div.innerText = "Song artist";
	liElementH5.appendChild(br);
	liElementH5.appendChild(liElementH5Div);
	liElement.appendChild(liElementDiv);
	liElement.appendChild(liElementH5);
	previewSongsDiv.appendChild(liElement);
}
createSongsPreview();