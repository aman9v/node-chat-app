/*jshint esversion:6*/
const expect = require('expect');
var {User} = require('./users.js');



describe("Users", () => {

  var users;
  beforeEach(() => {
    users = new User();
    users.users = [{
      id: "1",
      name: "Aman",
      room: "CSE"
    }, {
      id: "2",
      name: "Rajat",
      room: "EE"
    }, {
      id: "3",
      name: "Ankur",
      room: "EE"
    }];
  });

  it("should add new user", () => {
      var users = new User();
      var user = {
        id: "223",
        name: "Aman",
        room: "CSRE"
      };
      var res = users.addUser(user.id, user.name, user.room);
      expect(users.users).toEqual([user]);
  });

  it("should return names inside a room", () => {
    var userList = users.getUserList("EE"); // refers to the seed data defined above
    expect(userList).toEqual(["Rajat", "Ankur"]);
  });

  it("should return names inside a room", () => {
    var userList = users.getUserList("CSE"); // refers to the seed data defined above
    expect(userList).toEqual(["Aman"]);
  });

  it("should remove a user", () => {
    var removedUser = users.removeUser("1");
    expect(removedUser[0].name).toEqual("Aman");
    expect(users.users.length).toBe(2);
  });
  it("should not remove non-existent a user", () => {
    var res = users.removeUser('0');
    expect(res.length).toBe(0);
    expect(users.users.length).toBe(3);
  });

  it("should get a user", () => {
    var userId = "1";
    var user = users.getUser(userId);

    expect(user.id).toBe(userId);
  });

  it("should not get a non-existent user", () => {
    var userId = "0";
    var user = users.getUser(userId);

    expect(user).toBeFalsy();
  });
});
