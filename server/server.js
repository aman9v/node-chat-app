/* jshint esversion:6 */
const path = require('path'); // doesn't require to be installed using npm

const publicPath = path.join(__dirname, '../public'); // instead of going up a directory, it simply adds the path to public folder.
const port = process.env.PORT || 3000;
const express = require('express');
var app = express();

app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});
