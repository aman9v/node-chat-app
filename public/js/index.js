/* jshint esversion:6*/
// contains javascript that loads when index.html is loaded on the browser.

var socket = io(); // we are making a request to the server. this is important for all communications from c to s
socket.on("connect", function() { // this is client side javascript code that runs on the browser.
  console.log('Connected to the server');
});

socket.on("disconnect", function() {
  console.log("Disconnected from the server");
});
// creates an event handler that listens to a new email event from the server that
// can then be rendered to the browser using jquery or react or any other front end framework
// so a user can see the email as soon as it comes in.
socket.on('newMessage', function(message) { // this event will fire off every time there is a new email.
  console.log(`From: ${message.from} Saying: ${message.text}  At: ${message.createdAt}`); // data that is sent along with the event is passed as argument to the callback
}); // this event has been emitted by the server in the server.js file
// so, we are able to send not only an event but also some data that wasn't possible with a simple http API
