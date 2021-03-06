/* jshint esversion:6*/
// contains javascript that loads when index.html is loaded on the browser.


var socket = io(); // we are making a request to the server. this is important for all communications from c to s
var scrollToBottom = function() { // called each time a message is added to the chat area
  // selectors
  var messages = $("#messages");
  var newMessage = messages.children("li:last-child");
  // heights
  var clientHeight = messages.prop('clientHeight'); // prop is a cross platform method used to fetch a property
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight(); // gets the height of the message in pixels
  var lastMessageHeight = newMessage.prev().innerHeight(); // second last list item

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight); // jQuery method to set the scrollTop value
  }
};

socket.on("connect", function() { // this is client side javascript code that runs on the browser.
  var params = $.deparam(window.location.search);

  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("No error");
    }
  });
});

socket.on("disconnect", function() {
  console.log("Disconnected from the server");
});

socket.on("updateUserList", function(users) { // users is just an array of names of users
  var ul = $("<ul></ul>");
  users.forEach(function(user) {
    ul.append($("<li></li>").text(user));
  });
  $("#users").html(ul);
});
// creates an event handler that listens to a new email event from the server that
// can then be rendered to the browser using jquery or react or any other front end framework
// so a user can see the email as soon as it comes in.
socket.on('newMessage', function(message) { // this event will fire off every time there is a new email.
console.log(`From: ${message.from} Saying: ${message.text}  At: ${message.createdAt}`); // data that is sent along with the event is passed as argument to the callback
var formattedTime = moment(message.createAt).format("h:mm A");
  var template = $('#message-template').html(); //returns the markup inside the message template which is the <p> tag
  var rendered = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $('#messages').append(rendered);
  scrollToBottom();
});
  // var li = $("<li></li>");
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  // $('#messages').append(li);
 // this event has been emitted by the server in the server.js file
// so, we are able to send not only an event but also some data that wasn't possible with a simple http API

socket.on('newLocationMessage', function(message) {
  // var li = $('<li></li>');
  // var a = $('<a target="_blank">My current location</a>');
  var formattedTime = moment(message.createdAt).format("h:mm A");
  var template = $("#location-message-template").html();
  var rendered = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });

  $("#messages").append(rendered);
  scrollToBottom();
  // li.text(`${message.from} ${formattedTime}:`);
  // a.attr("href", message.url); // get and set attribute values from jQuery selected elements
  // li.append(a);
  // $('#messages').append(li);
});

$('#message-form').on('submit', function(e) {
  e.preventDefault();
  var messageTextBox = $('[name=message]');
  socket.emit('createMessage', {
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
