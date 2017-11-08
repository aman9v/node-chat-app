/* jshint esversion: 6*/
var expect = require('expect');

var {generateMessage} = require('./message');

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
