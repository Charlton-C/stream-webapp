var expandLibraryButton = document.querySelector("#music_side-library");
var expandSongsButton = document.querySelector(".expand-songs-div");


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