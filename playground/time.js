/* jshint esversion:6*/

// unix epoch Jan 1st 1970 00:00:00 am

// -1000 goes 1s into the past from the above timestamp i.e 31st Dec 1969 23:59:59

const moment = require('moment') ;

var now = moment(); // creates an object that represents current moment in time
console.log(now.format("MMM Do YYYY"));
console.log(now.format("h:mm A"));
