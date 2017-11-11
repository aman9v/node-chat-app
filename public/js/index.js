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
  var li = $("<li></li>");
  li.text(`${message.from}: ${message.text}`);
  $('#messages').append(li);
}); // this event has been emitted by the server in the server.js file
// so, we are able to send not only an event but also some data that wasn't possible with a simple http API

// socket.emit('createMessage', {
//   from: "Nidhi",
//   text: "Will you marry me?"
// }, function(ack) {
//   console.log(ack + "got it");
// });
// we are sending a callback that will be executed on the client when the event has been listened to on the server side.
// Also, we have an option of sending some data back to the client. This can be facilitated by adding arguments to the sent callback which will
// be sent or populated by the server and can be used inside of the callback on the client side.

$('#message-form').on('submit', function(e) {
  e.preventDefault();
  socket.emit('createMessage', {
    from: "User",
    text: $('[name=message]').val()
  }, function(ack) {
    console.log(ack + "got it");
  });
});
