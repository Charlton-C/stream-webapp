var daysLeftSpan = document.querySelector(".days-left-span");
var hoursLeftSpan = document.querySelector(".hours-left-span");
var minutesLeftSpan = document.querySelector(".minutes-left-span");
var secondsLeftSpan = document.querySelector(".seconds-left-span");
var comingSoonDayName = document.querySelector(".coming-soon-day-name");
var comingSoonDateNumber = document.querySelector(".coming-soon-date-number");
var comingSoonMonthNumber = document.querySelector(".coming-soon-month-number");
var comingSoonYearNumber = document.querySelector(".coming-soon-year-number");
var comingSoonTimeNumber = document.querySelector(".coming-soon-time-number");
var localTime = new Date();
var countdownTimerEnd = new Date(2024, 1, 10, 6, 0, 0, 0);