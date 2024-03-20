var daysLeftSpan = document.querySelector(".days-left-span");
var hoursLeftSpan = document.querySelector(".hours-left-span");
var minutesLeftSpan = document.querySelector(".minutes-left-span");
var secondsLeftSpan = document.querySelector(".seconds-left-span");
var comingSoonDayName = document.querySelector(".coming-soon-day-name");
var comingSoonDateNumber = document.querySelector(".coming-soon-date-number");
var comingSoonMonthNumber = document.querySelector(".coming-soon-month-number");
var comingSoonYearNumber = document.querySelector(".coming-soon-year-number");
var comingSoonTimeNumber = document.querySelector(".coming-soon-time-number");
var localTimeDate = new Date();
// Year, Month (0-11), Day (1-31), Hours, Minutes, Seconds, Milliseconds
var countdownTimerEndDate = new Date(2024, 1, 5, 0, 0, 0, 0);


var setIntervalThatUpdatesScreen = setInterval(() => {
	localTimeDate = new Date();
	if(Math.floor(localTimeDate.getTime()/1000) != Math.floor(countdownTimerEndDate.getTime()/1000)){
		updateScreenWithRemainingTime();
	}
	else{
		clearInterval(setIntervalThatUpdatesScreen);
		let aElement = document.createElement("a");
		aElement.setAttribute("href", "index.html");
		aElement.click();
	}
	// Just in case it doesn't switch files
	if(Number(daysLeftSpan.innerText) < 0){
		clearInterval(setIntervalThatUpdatesScreen);
		let aElement = document.createElement("a");
		aElement.setAttribute("href", "index.html");
		aElement.click();
	}
}, 1000);

function displayCountdownTimerEndDate(){
	let hours;
	let minutes;
	let seconds;
	// Set day name
	daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	comingSoonDayName.innerText = daysOfTheWeek[countdownTimerEndDate.getDay()];

	// Set date number
	if(countdownTimerEndDate.getDate() < 10){
		comingSoonDateNumber.innerText = "0"+countdownTimerEndDate.getDate();
	}
	else if(countdownTimerEndDate.getDate() >= 10){
		comingSoonDateNumber.innerText = countdownTimerEndDate.getDate();
	}
	else{}

	// Set month number
	if((countdownTimerEndDate.getMonth())+1 < 10){
		comingSoonMonthNumber.innerText = "0"+(countdownTimerEndDate.getMonth()+1);
	}
	else if((countdownTimerEndDate.getMonth())+1 >= 10){
		comingSoonMonthNumber.innerText = (countdownTimerEndDate.getMonth()+1);
	}
	else{}

	// Set year number
	comingSoonYearNumber.innerText = countdownTimerEndDate.getFullYear();

	// Set time number
	// Set hour number
	if(countdownTimerEndDate.getHours() < 10){
		hours = "0"+countdownTimerEndDate.getHours();
	}
	else if(countdownTimerEndDate.getHours() >= 10){
		hours = countdownTimerEndDate.getHours();
	}
	else{}
	// Set minute number
	if(countdownTimerEndDate.getMinutes() < 10){
		minutes = "0"+countdownTimerEndDate.getMinutes();
	}
	else if(countdownTimerEndDate.getMinutes() >= 10){
		minutes = countdownTimerEndDate.getMinutes();
	}
	else{}
	// Set seconds number
	if(countdownTimerEndDate.getSeconds() < 10){
		seconds = "0"+countdownTimerEndDate.getSeconds();
	}
	else if(countdownTimerEndDate.getSeconds() >= 10){
		seconds = countdownTimerEndDate.getSeconds();
	}
	else{}
	comingSoonTimeNumber.innerText = hours+":"+minutes+":"+seconds;
}
displayCountdownTimerEndDate();


function getTimeUntilCountdownEnds(countdownTimerEndDate, localTimeDate){
	let remainingTime = [];
	let remainingTimeInMilliseconds = countdownTimerEndDate-localTimeDate;
	let remainingTimeInSeconds = Math.floor(remainingTimeInMilliseconds/1000);
	let remainingTimeInMinutes = Math.floor(remainingTimeInSeconds/60);
	let remainingTimeInHours = Math.floor(remainingTimeInMinutes/60);

	// Get days until countdown end
	let remainingDays = Math.floor(remainingTimeInHours/24);
	remainingTime[0] = remainingDays;

	// Get hours until countdown end
	remainingTime[1] = remainingTimeInHours-(remainingDays*24);

	// Get minutes until countdown end
	remainingTime[2] = remainingTimeInMinutes-(remainingTimeInHours*60);

	// Get seconds until countdown end
	remainingTime[3] = remainingTimeInSeconds-(remainingTimeInMinutes*60);


	return remainingTime;
}

function updateScreenWithRemainingTime(){
	let getTimeUntilCountdownEndsVariable = getTimeUntilCountdownEnds(countdownTimerEndDate, localTimeDate);
	// Update days remaining
	if(getTimeUntilCountdownEndsVariable[0] < 0){
		daysLeftSpan.innerText = getTimeUntilCountdownEndsVariable[0];
	}
	else if(getTimeUntilCountdownEndsVariable[0] < 10){
		daysLeftSpan.innerText = "0"+getTimeUntilCountdownEndsVariable[0];
	}
	else if(getTimeUntilCountdownEndsVariable[0] >= 10){
		daysLeftSpan.innerText = getTimeUntilCountdownEndsVariable[0];
	}
	else{}

	// Update hours remaining
	if(getTimeUntilCountdownEndsVariable[1] < 10){
		hoursLeftSpan.innerText = "0"+getTimeUntilCountdownEndsVariable[1];
	}
	else if(getTimeUntilCountdownEndsVariable[1] >= 10){
		hoursLeftSpan.innerText = getTimeUntilCountdownEndsVariable[1];
	}
	else{}

	// Update minutes remaining
	if(getTimeUntilCountdownEndsVariable[2] < 10){
		minutesLeftSpan.innerText = "0"+getTimeUntilCountdownEndsVariable[2];
	}
	else if(getTimeUntilCountdownEndsVariable[2] >= 10){
		minutesLeftSpan.innerText = getTimeUntilCountdownEndsVariable[2];
	}
	else{}

	// Update seconds remaining
	if(getTimeUntilCountdownEndsVariable[3] < 10){
		secondsLeftSpan.innerText = "0"+getTimeUntilCountdownEndsVariable[3];
	}
	else if(getTimeUntilCountdownEndsVariable[3] >= 10){
		secondsLeftSpan.innerText = getTimeUntilCountdownEndsVariable[3];
	}
	else{}
}


function lazyLoadBackgroundImage(){
	let imageURL = "/resources/images/maintenance-background.jpg";
	let image = new Image();
	image.src = imageURL;
	let setIntervalForLazyLoadingBackgroundImage = setInterval(() => {
		if(image.complete){
			document.querySelector(".background-image-container").style.animation = "showByChangingOpacitySlowly 3s linear 0s 1 normal forwards";
			document.querySelector(".background-image-container").style.backgroundImage = "url("+imageURL+")";
			document.querySelector(".background-image-container").style.backgroundSize = "100vw";
			clearInterval(setIntervalForLazyLoadingBackgroundImage);
		}
	}, 500);
}
lazyLoadBackgroundImage();