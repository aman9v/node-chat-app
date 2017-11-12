/* jshint esversion: 6*/
var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var text = "Hello from the other side!";
    var from = "Mr. X";
    var result = generateMessage(from, text);

    expect(result.from).toBe(from);
    expect(result.text).toBe(text);
    expect(typeof(result.createdAt)).toEqual('number');
  });
});

describe("generateLocationMessage", () => {
  it('should generate correct location object', () => {
    var from = "Archie";
    var lat = 19.1394028;
    var long = 72.9047021;
    var url = `https://www.google.com/maps?q=${lat},${long}`;
    var result = generateLocationMessage(from, lat, long);

    expect(result.from).toBe(from);
    expect(result.url).toBe(url);
    expect(typeof(result.createdAt)).toEqual('number');
  });
});
