/* jshint esversion:6*/

var generateMessage = (from, text) => {
  return  {
    from,
    text,
    createdAt: new Date().getTime()
  };
};

module.exports = {generateMessage};
