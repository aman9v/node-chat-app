/* jshint esversion:6 */

// array of objects with socketid, name, room name
// addUser(id, name, room)
// removeUser(socket_id)
// getUser(socket_id) -> array of user objects
//getUserList(room)

// ES6 classes

// class Person {
//     constructor(name, age) {
//       this.name = name;
//       this.age = age;
//     }
//     getUserDesc() {
//       return "A person"
//     }
// }
//
// var p = new Person("Aman", 25);
// console.log("this.name", p.name);

class User {
  constructor() {
    this.users = []; // array for storing user objects
  }

  addUser(id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }
  removeUser(id) {
    // return user that was removed
    var user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  }
  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }
  getUserList(room) { // gets users in a specified room
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => user.name);
    return namesArray;
  }
}

module.exports = {User};
