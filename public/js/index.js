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

socket.on('newLocationMessage', function(message) {
  var li = $('<li></li>');
  var a = $('<a target="_blank">My current location</a>');

  li.text(`${message.from}:`);
  a.attr("href", message.url); // get and set attribute values from jQuery selected elements
  li.append(a);
  $('#messages').append(li);
});

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
  var messageTextBox = $('[name=message]');
  socket.emit('createMessage', {
    from: "User",
    text: messageTextBox.val()
  }, function() {
    messageTextBox.val(""); // passing an empty string clears the text box
  });
});

var locationButton = $('#send-location'); // jQuery selector that targets the button
locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  locationButton.attr('disabled', 'disabled').text("Sending Location...");
  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text("Send Location");
    socket.emit("createLocationMessage", {
      latitude:position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }, function() {
    locationButton.removeAttr('disabled').text("Send Location");
    alert("Unable to fetch location");
  });
});
