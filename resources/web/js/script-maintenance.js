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
var countdownTimerEndDate = new Date(2024, 1, 10, 6, 0, 0, 0);


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